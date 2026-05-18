"use client";

import { useAuth } from "@/hooks/useAuth";
import { uploadStorageKey, type StoredUpload } from "@/lib/detection-types";
import { useLocale } from "@/lib/i18n/locale-context";
import { instruments } from "@/lib/instruments";
import {
  ArrowRight,
  Camera,
  FileImage,
  ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function UploadDropzone() {
  const router = useRouter();
  const { t } = useLocale();
  const { user, requireAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const image = new window.Image();
        image.onerror = reject;
        image.onload = () => {
          const maxSide = 1280;
          const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
          const width = Math.max(1, Math.round(image.width * scale));
          const height = Math.max(1, Math.round(image.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          if (!context) {
            resolve(String(reader.result));
            return;
          }
          context.drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        image.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  async function readFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setMessage("Hãy chọn ảnh trước khi quét.");
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setPreview(dataUrl);
      setFileName(file.name);
      setFileType(file.type);
      setMessage("");
    } catch (error) {
      setMessage("Không thể đọc ảnh. Vui lòng thử lại.");
    }
  }

  function beginDetection() {
    if (!preview) {
      setMessage("Hãy chọn ảnh trước khi quét.");
      return;
    }

    const run = () => {
      const upload: StoredUpload = {
        fileName,
        fileType,
        previewDataUrl: preview,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(uploadStorageKey, JSON.stringify(upload));
      router.push("/detect");
    };

    if (!user) {
      requireAuth(run);
      return;
    }
    run();
  }

  function clearUpload() {
    setPreview(null);
    setFileName("");
    setFileType("");
    setMessage("");
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_0.72fr]">
      <section
        className={`museum-card relative min-h-[31rem] overflow-hidden p-5 transition ${
          isDragging ? "border-gold/70 bg-gold/10" : ""
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files.item(0);
          if (file) readFile(file);
        }}
      >
        <div className="absolute inset-6 rounded-lg border border-dashed border-gold/30" />
        <div className="relative flex h-full min-h-[28rem] flex-col items-center justify-center gap-6 text-center">
          {preview ? (
            <div className="relative h-64 w-full overflow-hidden rounded-lg border border-white/10 sm:h-80">
              <Image
                src={preview}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
              <button
                className="icon-button absolute right-3 top-3 grid size-10 place-items-center rounded-full border border-white/15 bg-background/70 text-foreground backdrop-blur"
                type="button"
                onClick={clearUpload}
                aria-label="Xóa ảnh"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="grid size-24 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
              <UploadCloud size={36} aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-sm uppercase text-gold">{t.scan.kicker}</p>
            <h1 className="font-display mt-3 max-w-2xl text-4xl leading-tight text-foreground sm:text-6xl">
              {t.scan.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">
              {preview ? fileName : message || t.scan.body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) readFile(file);
              }}
            />
            <input
              ref={cameraInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) readFile(file);
              }}
            />
            <button
              className="museum-button px-6"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileImage size={18} aria-hidden="true" />
              {t.scan.upload}
            </button>
            <button
              className="museum-button px-6"
              type="button"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={18} aria-hidden="true" />
              {t.scan.camera}
            </button>
          </div>
        </div>
      </section>
      <aside className="museum-card flex flex-col justify-between gap-8 p-6">
        <div>
          <div className="grid size-12 place-items-center rounded-lg border border-sage/40 bg-sage/15 text-sage">
            <ImageIcon size={21} aria-hidden="true" />
          </div>
          <h2 className="font-display mt-8 text-3xl text-foreground">
            {t.scan.supported}
          </h2>
          <p className="mt-4 leading-8 text-muted">{t.scan.body}</p>
          <div className="mt-6 grid grid-cols-5 gap-2">
            {instruments.map((inst) => (
              <div
                key={inst.id}
                className="relative aspect-square overflow-hidden rounded-sm border border-white/10"
              >
                <Image
                  src={inst.heroImage}
                  alt={inst.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className="museum-button w-full px-6"
          type="button"
          onClick={beginDetection}
        >
          {t.scan.begin}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        {!user ? (
          <p className="text-center text-xs text-gold/80">{t.scan.previewOnly}</p>
        ) : null}
        <p className="min-h-6 text-sm text-muted" role="status">
          {message}
        </p>
      </aside>
    </div>
  );
}

