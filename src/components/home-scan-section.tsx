"use client";

import { useAuth } from "@/hooks/useAuth";
import { uploadStorageKey, type StoredUpload } from "@/lib/detection-types";
import { useLocale } from "@/lib/i18n/locale-context";
import { instruments } from "@/lib/instruments";
import { motion } from "framer-motion";
import { Camera, FileImage, ScanLine, UploadCloud, Video, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export function HomeScanSection() {
  const { t } = useLocale();
  const { user, requireAuth } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [status, setStatus] = useState("");
  const [cameraMode, setCameraMode] = useState(false);

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
      setStatus("Chỉ chấp nhận tệp ảnh.");
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setPreview(dataUrl);
      setFileName(file.name);
      setFileType(file.type);
      setStatus("");
    } catch {
      setStatus("Không thể đọc ảnh. Vui lòng thử lại.");
    }
  }

  const openCamera = useCallback(async () => {
    // Check if getUserMedia is available for real camera access
    if (!navigator.mediaDevices?.getUserMedia) {
      // Fallback to file input with capture
      cameraRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraMode(true);

      // Retry attaching stream until video element is mounted (fixes double-click)
      const attachStream = (retries = 10) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        } else if (retries > 0) {
          setTimeout(() => attachStream(retries - 1), 50);
        }
      };
      // Use setTimeout to ensure React has flushed the state update
      setTimeout(() => attachStream(), 0);
    } catch (err) {
      // Camera permission denied or unavailable — fallback to file input
      cameraRef.current?.click();
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    // Stop camera
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraMode(false);

    setPreview(dataUrl);
    setFileName("camera-capture.jpg");
    setFileType("image/jpeg");
    setStatus("");
  }, []);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraMode(false);
  }, []);

  function startScan() {
    if (!preview) {
      setStatus("Hãy chọn ảnh trước.");
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

  return (
    <section
      id="scan"
      className="relative border-y border-white/10 py-24 sm:py-32"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,0.12),transparent_55%)]"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        className="relative mx-auto max-w-7xl px-5 sm:px-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-gold">
              <ScanLine size={16} aria-hidden="true" />
              {t.scan.kicker}
            </p>
            <h2 className="font-epic mt-6 text-4xl leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
              {t.scan.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              {t.scan.body}
            </p>
            {!user ? (
              <p className="mt-4 text-sm text-gold/80">{t.scan.previewOnly}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) readFile(file);
                }}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) readFile(file);
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
              <button
                type="button"
                className="museum-button px-5 py-2.5 text-sm uppercase tracking-[0.2em]"
                onClick={() => fileRef.current?.click()}
              >
                <FileImage size={17} aria-hidden="true" />
                {t.scan.upload}
              </button>
              <button
                type="button"
                className="museum-button border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm uppercase tracking-[0.2em]"
                onClick={openCamera}
              >
                <Camera size={17} aria-hidden="true" />
                {t.scan.camera}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-sm border border-white/12 bg-surface/60 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-black/40">
              {cameraMode ? (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  <div className="absolute inset-4 rounded-md border-2 border-dashed border-gold/40" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                    <button
                      type="button"
                      className="museum-button flex-1 justify-center py-3 text-sm uppercase tracking-[0.2em]"
                      onClick={capturePhoto}
                    >
                      <Camera size={17} />
                      Chụp
                    </button>
                    <button
                      type="button"
                      className="museum-button border-white/15 bg-white/[0.04] px-4 py-3"
                      onClick={closeCamera}
                    >
                      <X size={17} />
                    </button>
                  </div>
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-red-500/40 bg-background/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-red-400">
                    <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
                    <Video size={12} />
                    Camera
                  </div>
                </>
              ) : preview ? (
                <>
                  <Image
                    src={preview}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover opacity-90"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-white/15 bg-background/70 text-foreground backdrop-blur"
                    onClick={() => {
                      setPreview(null);
                      setFileName("");
                      setFileType("");
                    }}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <motion.div
                  className="flex h-full flex-col items-center justify-center gap-4 text-muted"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <UploadCloud size={40} className="text-gold/50" />
                  <span className="text-xs uppercase tracking-[0.35em]">
                    {t.scan.supported}
                  </span>
                </motion.div>
              )}

              {!cameraMode && (
                <>
                  <motion.div
                    className="soft-scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-gold/35 to-transparent"
                    style={{ opacity: preview ? 1 : 0.4 }}
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-6 rounded-md border border-gold/30"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/12 bg-background/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-gold"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="size-1.5 rounded-full bg-emerald-400/90" />
                    Quét AI
                  </motion.div>
                </>
              )}
            </div>
            <motion.button
              type="button"
              className="museum-button mt-4 w-full justify-center py-3 text-sm uppercase tracking-[0.25em]"
              onClick={startScan}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.scan.begin}
            </motion.button>
            {status ? (
              <p className="mt-3 text-center text-sm text-gold">{status}</p>
            ) : null}
            <div className="mt-6 grid grid-cols-5 gap-2">
              {instruments.map((inst) => (
                <motion.div
                  key={inst.id}
                  className="relative aspect-square overflow-hidden rounded-sm border border-white/8 opacity-70"
                  whileHover={{ opacity: 1, y: -2 }}
                >
                  <Image
                    src={inst.heroImage}
                    alt={inst.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
