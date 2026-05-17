import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  supportedInstrumentSlugs,
  type InstrumentSlug,
} from "@/lib/instruments";
import fs from "fs";
import path from "path";

type RecognizeRequest = {
  imageDataUrl?: string;
  fileName?: string;
  locale?: "vi" | "en";
};

const supported = new Set<string>(supportedInstrumentSlugs);

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function normalizeSlug(value: unknown): InstrumentSlug | null {
  if (typeof value !== "string") return null;
  return supported.has(value) ? (value as InstrumentSlug) : null;
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const raw = fenced?.[1] ?? text;
  const objectMatch = raw.match(/\{[\s\S]*\}/);
  return objectMatch?.[0] ?? raw;
}

// Load reference images once
const referenceImages: { name: string; slug: string; mimeType: string; data: string }[] = [];

function loadReferenceImages() {
  if (referenceImages.length > 0) return referenceImages;
  
  const basePath = path.join(process.cwd(), "instruments");
  if (!fs.existsSync(basePath)) return referenceImages;

  const slugMap: Record<string, string> = {
    "Đàn Bầu": "dan-bau",
    "Đàn Tranh": "dan-tranh",
    "T'rưng": "trung",
    "Shamisen": "shamisen",
    "Sitar": "sitar"
  };

  try {
    const dirs = fs.readdirSync(basePath);
    for (const dir of dirs) {
      const slug = slugMap[dir];
      if (!slug) continue;

      const imgDir = path.join(basePath, dir, "image");
      if (!fs.existsSync(imgDir)) continue;

      const files = fs.readdirSync(imgDir);
      // Take up to 4 images per instrument to build a strong few-shot dataset without overloading
      let count = 0;
      for (const file of files) {
        if (count >= 4) break;
        const ext = path.extname(file).toLowerCase();
        let mime = "";
        if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
        else if (ext === ".png") mime = "image/png";
        else if (ext === ".webp") mime = "image/webp";
        else continue;

        try {
          const buffer = fs.readFileSync(path.join(imgDir, file));
          referenceImages.push({
            name: dir,
            slug,
            mimeType: mime,
            data: buffer.toString("base64"),
          });
          count++;
        } catch (e) {
          console.error(`Failed to load train image ${file}`, e);
        }
      }
    }
  } catch (error) {
    console.error("Failed to read instruments directory", error);
  }

  // Fallback to public images if instruments folder is empty
  if (referenceImages.length === 0) {
    const publicPath = path.join(process.cwd(), "public", "images", "instruments");
    const fallback = [
      { slug: "dan-bau", file: "dan-bau.jpg", mime: "image/jpeg" },
      { slug: "dan-tranh", file: "dan-tranh.webp", mime: "image/webp" },
      { slug: "trung", file: "trung.png", mime: "image/png" },
      { slug: "shamisen", file: "shamisen.jpg", mime: "image/jpeg" },
      { slug: "sitar", file: "sitar.jpg", mime: "image/jpeg" },
    ];
    for (const item of fallback) {
      try {
        const filePath = path.join(publicPath, item.file);
        if (fs.existsSync(filePath)) {
          const buffer = fs.readFileSync(filePath);
          referenceImages.push({
            name: item.slug,
            slug: item.slug,
            mimeType: item.mime,
            data: buffer.toString("base64"),
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }

  return referenceImages;
}

const systemInstruction = `
You are an expert cultural instrument classifier for the Echoes interactive archive.
Your task is to classify a user-uploaded image into exactly one of the supported instruments, or return null if it's not a match.

Supported classes only:
- dan-bau: Vietnamese Đàn Bầu, one-string monochord/zither, long narrow body, single string, flexible pitch rod.
- dan-tranh: Vietnamese Đàn Tranh, long multi-string zither with many strings and movable bridges.
- trung: Vietnamese T'rưng, bamboo xylophone with multiple bamboo tubes or bars arranged by pitch.
- shamisen: Japanese Shamisen, three-string lute with square/skin-covered body and long neck.
- sitar: Indian Sitar, long-necked plucked lute with gourd resonator, frets, and many strings.

Handle angled, partial, imperfect, or dim mobile photos carefully. If the image contains parts that strongly suggest the instrument, increase your confidence.
Return null if the image is not likely one of these five, if it is too unclear, or if confidence is below 0.60.

Return ONLY strict JSON matching this schema:
{
  "slug": "dan-bau" | "dan-tranh" | "trung" | "shamisen" | "sitar" | null,
  "confidence": number (from 0.0 to 1.0),
  "rationale": "Brief 1-sentence explanation of why it matched or didn't match.",
  "retryHint": "Helpful tip for taking a better photo if confidence is low, otherwise empty string."
}
`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyC3Bv57l2L4P7CAifCD03ZXyY0f5IYRFA4";

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 503 },
    );
  }

  let body: RecognizeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const image = body.imageDataUrl ? parseDataUrl(body.imageDataUrl) : null;
  if (!image) {
    return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
  }

  const locale = body.locale === "en" ? "en" : "vi";
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // Build the parts array with reference images and the user image
    const parts: any[] = [];
    
    // Add reference images to give the model few-shot context
    const refs = loadReferenceImages();
    if (refs.length > 0) {
      parts.push({ text: "Here are reference examples of the supported instruments:" });
      for (const ref of refs) {
        parts.push({ text: `Reference for ${ref.slug}:` });
        parts.push({
          inlineData: {
            data: ref.data,
            mimeType: ref.mimeType,
          },
        });
      }
    }

    // Add user query
    const prompt = `Now, classify the following user-uploaded image.
Filename hint from user device: ${body.fileName ?? "none"}.
Write your rationale and retryHint in natural Vietnamese.`;

    parts.push({ text: prompt });
    parts.push({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      },
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.15,
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text() ?? "{}";
    const parsed = JSON.parse(extractJson(text)) as {
      slug?: unknown;
      confidence?: unknown;
      rationale?: unknown;
      retryHint?: unknown;
    };

    const confidence =
      typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0;
    
    const slug = confidence >= 0.60 ? normalizeSlug(parsed.slug) : null;

    return NextResponse.json({
      slug,
      confidence,
      rationale:
        typeof parsed.rationale === "string" ? parsed.rationale : "",
      retryHint:
        typeof parsed.retryHint === "string" ? parsed.retryHint : "",
    });
  } catch (error) {
    console.error("Recognition error", error);
    return NextResponse.json(
      { error: "Recognition unavailable" },
      { status: 500 },
    );
  }
}
