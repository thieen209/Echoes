import { instruments, type InstrumentSlug } from "@/lib/instruments";

export type MatchResult = {
  slug: InstrumentSlug | null;
  confidence: number;
  scores: Record<InstrumentSlug, number>;
};

const REFERENCE_SIZE = 72;
const CONFIDENCE_THRESHOLD = 0.42;
const MIN_MARGIN = 0.06;

type ImageFeatures = {
  histogram: Float32Array;
  avgHue: number;
  avgSat: number;
  avgVal: number;
  aspect: number;
  edgeDensity: number;
};

let referenceCache: Map<InstrumentSlug, ImageFeatures> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function extractFeatures(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): ImageFeatures {
  const { data } = ctx.getImageData(0, 0, w, h);
  const bins = 24;
  const histogram = new Float32Array(bins * bins);
  let hueSum = 0;
  let satSum = 0;
  let valSum = 0;
  let count = 0;
  let edges = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const v = max;
      const s = max === 0 ? 0 : (max - min) / max;
      let hDeg = 0;
      if (max !== min) {
        if (max === r) hDeg = ((g - b) / (max - min) + 6) % 6;
        else if (max === g) hDeg = (b - r) / (max - min) + 2;
        else hDeg = (r - g) / (max - min) + 4;
        hDeg *= 60;
      }
      if (v > 0.12 && s > 0.08) {
        const hb = Math.min(bins - 1, Math.floor((hDeg / 360) * bins));
        const sb = Math.min(bins - 1, Math.floor(s * bins));
        histogram[hb * bins + sb] += 1;
        hueSum += hDeg;
        satSum += s;
        valSum += v;
        count += 1;
      }

      const iUp = ((y - 1) * w + x) * 4;
      const lum =
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const lumUp =
        0.299 * data[iUp] +
        0.587 * data[iUp + 1] +
        0.114 * data[iUp + 2];
      if (Math.abs(lum - lumUp) > 28) edges += 1;
    }
  }

  const total = histogram.reduce((a, b) => a + b, 0) || 1;
  for (let i = 0; i < histogram.length; i++) histogram[i] /= total;

  return {
    histogram,
    avgHue: count ? hueSum / count : 0,
    avgSat: count ? satSum / count : 0,
    avgVal: count ? valSum / count : 0,
    aspect: w / h,
    edgeDensity: edges / ((w - 2) * (h - 2)),
  };
}

async function featuresFromSource(src: string): Promise<ImageFeatures> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  const aspect = img.width / img.height;
  let w = REFERENCE_SIZE;
  let h = REFERENCE_SIZE;
  if (aspect > 1) h = Math.round(REFERENCE_SIZE / aspect);
  else w = Math.round(REFERENCE_SIZE * aspect);
  canvas.width = Math.max(32, w);
  canvas.height = Math.max(32, h);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return extractFeatures(ctx, canvas.width, canvas.height);
}

function histogramSimilarity(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.min(a[i], b[i]);
  }
  return sum;
}

function compareFeatures(a: ImageFeatures, b: ImageFeatures): number {
  const hist = histogramSimilarity(a.histogram, b.histogram);
  const hueDiff = Math.abs(a.avgHue - b.avgHue) / 180;
  const satDiff = Math.abs(a.avgSat - b.avgSat);
  const valDiff = Math.abs(a.avgVal - b.avgVal);
  const aspectDiff = Math.abs(a.aspect - b.aspect) / Math.max(a.aspect, b.aspect, 1);
  const edgeDiff = Math.abs(a.edgeDensity - b.edgeDensity);

  const colorScore = 1 - (hueDiff * 0.35 + satDiff * 0.25 + valDiff * 0.2);
  const shapeScore = 1 - (aspectDiff * 0.35 + edgeDiff * 0.65);

  return hist * 0.55 + colorScore * 0.3 + shapeScore * 0.15;
}

async function loadReferences(): Promise<Map<InstrumentSlug, ImageFeatures>> {
  if (referenceCache) return referenceCache;
  const map = new Map<InstrumentSlug, ImageFeatures>();
  await Promise.all(
    instruments.map(async (inst) => {
      const features = await featuresFromSource(inst.heroImage);
      map.set(inst.id, features);
    }),
  );
  referenceCache = map;
  return map;
}

export async function matchInstrumentFromImage(
  dataUrl: string,
  fileName?: string,
): Promise<MatchResult> {
  const refs = await loadReferences();
  const query = await featuresFromSource(dataUrl);

  const scores = {} as Record<InstrumentSlug, number>;
  let best: InstrumentSlug | null = null;
  let bestScore = 0;
  let secondScore = 0;

  for (const inst of instruments) {
    const ref = refs.get(inst.id);
    if (!ref) continue;
    const score = compareFeatures(query, ref);
    scores[inst.id] = score;
    if (score > bestScore) {
      secondScore = bestScore;
      bestScore = score;
      best = inst.id;
    } else if (score > secondScore) {
      secondScore = score;
    }
  }

  const nameHint = (fileName ?? "").toLowerCase();
  for (const inst of instruments) {
    const slug = inst.id.replace("-", " ");
    if (nameHint.includes(inst.id) || nameHint.includes(slug)) {
      scores[inst.id] = Math.min(1, scores[inst.id] + 0.25);
      if (scores[inst.id] > bestScore) {
        secondScore = bestScore;
        bestScore = scores[inst.id];
        best = inst.id;
      }
    }
  }

  const margin = bestScore - secondScore;
  const confidence = Math.min(0.98, bestScore * 0.85 + margin * 0.5);

  if (
    !best ||
    confidence < CONFIDENCE_THRESHOLD ||
    margin < MIN_MARGIN
  ) {
    return { slug: null, confidence, scores };
  }

  return { slug: best, confidence, scores };
}

export const MATCH_CONFIDENCE_THRESHOLD = CONFIDENCE_THRESHOLD;
