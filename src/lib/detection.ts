import type { DetectionInput } from "@/lib/detection-types";
import {
  matchInstrumentFromImage,
  type MatchResult,
} from "@/lib/image-matcher";
import {
  supportedInstrumentSlugs,
  type InstrumentSlug,
} from "@/lib/instruments";

export type { DetectionInput } from "@/lib/detection-types";

export type DetectionOutcome = MatchResult & {
  fromKeywords: boolean;
  source?: "metadata" | "gemini" | "local";
  rationale?: string;
  retryHint?: string;
};

const keywordMap: Array<{ id: InstrumentSlug; terms: string[] }> = [
  {
    id: "dan-bau",
    terms: ["dan bau", "dan-bau", "danbau", "đàn bầu", "monochord", "bau"],
  },
  {
    id: "dan-tranh",
    terms: ["dan tranh", "dan-tranh", "dantranh", "đàn tranh", "zither", "tranh"],
  },
  {
    id: "trung",
    terms: ["t'rung", "trung", "t-rung", "t'rưng", "bamboo", "xylophone"],
  },
  {
    id: "shamisen",
    terms: ["shamisen", "samisen", "japanese lute"],
  },
  {
    id: "sitar",
    terms: ["sitar", "hindustani", "indian lute"],
  },
];

/** Fast filename / metadata hint before image analysis */
export function detectFromMetadata(input: DetectionInput): InstrumentSlug | null {
  const fileName = input.fileName?.trim() ?? "";
  const fileType = input.fileType?.trim() ?? "";

  if (fileType && !fileType.toLowerCase().startsWith("image/")) {
    return null;
  }

  const source = fileName.toLowerCase();
  const directMatch = keywordMap.find(({ terms }) =>
    terms.some((term) => source.includes(term)),
  );
  return directMatch?.id ?? null;
}

export async function detectInstrumentAsync(
  input: DetectionInput,
  locale: "vi" | "en" = "vi",
): Promise<DetectionOutcome> {
  const meta = detectFromMetadata(input);
  if (meta) {
    return {
      slug: meta,
      confidence: 0.92,
      scores: Object.fromEntries(
        supportedInstrumentSlugs.map((id) => [id, id === meta ? 0.92 : 0.2]),
      ) as DetectionOutcome["scores"],
      fromKeywords: true,
      source: "metadata",
    };
  }

  if (!input.previewDataUrl) {
    return {
      slug: null,
      confidence: 0,
      scores: Object.fromEntries(
        supportedInstrumentSlugs.map((id) => [id, 0]),
      ) as DetectionOutcome["scores"],
      fromKeywords: false,
      source: "local",
    };
  }

  try {
    const response = await fetch("/api/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl: input.previewDataUrl,
        fileName: input.fileName,
        locale,
      }),
    });

    if (response.ok) {
      const result = (await response.json()) as {
        slug: InstrumentSlug | null;
        confidence: number;
        rationale?: string;
        retryHint?: string;
      };

      return {
        slug: result.slug,
        confidence: Math.max(0, Math.min(1, result.confidence)),
        scores: Object.fromEntries(
          supportedInstrumentSlugs.map((id) => [
            id,
            id === result.slug ? result.confidence : 0,
          ]),
        ) as DetectionOutcome["scores"],
        fromKeywords: false,
        source: "gemini",
        rationale: result.rationale,
        retryHint: result.retryHint,
      };
    }
  } catch {
    // Fall back to the local visual matcher when the API is unavailable.
  }

  const match = await matchInstrumentFromImage(
    input.previewDataUrl,
    input.fileName,
  );
  return { ...match, fromKeywords: false, source: "local" };
}

/** @deprecated Use detectInstrumentAsync for image uploads */
export function detectInstrument(input: DetectionInput): InstrumentSlug | null {
  const meta = detectFromMetadata(input);
  if (meta) return meta;
  return null;
}
