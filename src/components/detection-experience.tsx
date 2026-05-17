"use client";

import { detectInstrumentAsync } from "@/lib/detection";
import { uploadStorageKey, type DetectionInput } from "@/lib/detection-types";
import { useLocale } from "@/lib/i18n/locale-context";
import { instruments } from "@/lib/instruments";
import { motion } from "framer-motion";
import { Activity, Boxes, Radar, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function DetectionExperience() {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [upload, setUpload] = useState<DetectionInput | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(6);
  const [confidence, setConfidence] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchNote, setMatchNote] = useState("");

  const analysisLines = useMemo(
    () => [
      t.detect.analyzing,
      t.detect.matching,
      t.detect.resonance,
      t.detect.profile,
    ],
    [t],
  );

  const archiveMatches = useMemo(
    () =>
      instruments.map((inst) => ({
        id: inst.id,
        label: `${inst.name} · ${inst.originCountry}`,
      })),
    [],
  );

  const preview = upload?.previewDataUrl ?? null;
  const selectedLine = analysisLines[lineIndex % analysisLines.length];

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const rawUpload = window.sessionStorage.getItem(uploadStorageKey);

      if (!rawUpload) {
        router.replace("/unsupported");
        return;
      }

      try {
        setUpload(JSON.parse(rawUpload) as DetectionInput);
      } catch {
        router.replace("/unsupported");
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [router]);

  useEffect(() => {
    const lineTimer = window.setInterval(() => {
      setLineIndex((current) => current + 1);
    }, 1050);

    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(current + 5, 92));
    }, 340);

    return () => {
      window.clearInterval(lineTimer);
      window.clearInterval(progressTimer);
    };
  }, []);

  useEffect(() => {
    if (!upload?.previewDataUrl) {
      return undefined;
    }

    let cancelled = false;
    const analysisTimer = window.setTimeout(() => setAnalyzing(true), 0);

    const run = async () => {
      const outcome = await detectInstrumentAsync(upload, locale);
      if (cancelled) return;

      const pct = Math.round(outcome.confidence * 100);
      setConfidence(pct);
      setProgress(100);
      setMatchNote(outcome.rationale || outcome.retryHint || "");

      await new Promise((r) => window.setTimeout(r, 1800));
      if (cancelled) return;

      if (outcome.slug) {
        sessionStorage.setItem(
          "echoes-last-match",
          JSON.stringify({ slug: outcome.slug, confidence: outcome.confidence }),
        );
        router.replace(`/instrument/${outcome.slug}`);
        return;
      }

      sessionStorage.setItem(
        "echoes-last-match",
        JSON.stringify({ slug: null, confidence: outcome.confidence }),
      );
      router.replace("/unsupported");
    };

    void run();

    return () => {
      cancelled = true;
      window.clearTimeout(analysisTimer);
    };
  }, [upload, router, locale]);

  return (
    <section className="relative mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:pt-36">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,0.12),transparent_60%)]"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Radar size={16} aria-hidden="true" />
            {t.detect.liveAnalysis}
          </p>
          <h1 className="font-epic mt-6 max-w-3xl text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
            {t.detect.headline}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
            {t.detect.body}
          </p>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="rounded-md border border-white/10 bg-background/60 p-4 backdrop-blur-xl"
              animate={analyzing ? { borderColor: "rgba(200,169,107,0.35)" } : {}}
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted">
                {t.scan.confidence}
              </p>
              <p className="mt-3 font-epic text-4xl text-foreground">
                {confidence}%
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-bronze via-gold to-foreground"
                  animate={{ width: `${Math.max(confidence, progress * 0.9)}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
            </motion.div>
            <div className="rounded-md border border-white/10 bg-background/60 p-4 backdrop-blur-xl">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted">
                {t.detect.archiveDepth}
              </p>
              <p className="mt-3 flex items-center gap-2 text-2xl text-foreground">
                <Boxes size={22} className="text-gold" aria-hidden="true" />5
              </p>
            </div>
            <motion.div
              className="rounded-md border border-white/10 bg-background/60 p-4 backdrop-blur-xl"
              animate={{ opacity: analyzing ? [0.7, 1, 0.7] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted">
                {t.detect.signal}
              </p>
              <p className="mt-3 flex items-center gap-2 text-2xl text-foreground">
                <Activity size={22} className="text-gold" aria-hidden="true" />
                {analyzing ? t.detect.scanning : t.detect.stable}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-10 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted"
              key={selectedLine}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{selectedLine}</span>
              <span>{progress}%</span>
            </motion.div>
            <motion.div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gold"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute -inset-4 rounded-md border border-gold/15 bg-gradient-to-b from-gold/10 via-transparent to-transparent opacity-70 blur-2xl"
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative overflow-hidden rounded-md border border-white/12 bg-surface/70 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-sm bg-black/40 sm:aspect-[16/11]"
              animate={analyzing ? { scale: [1, 1.01, 1] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover opacity-85"
                />
              ) : (
                <div className="grid h-full min-h-[22rem] place-items-center text-muted">
                  …
                </div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,13,15,0.86),transparent_42%,rgba(12,13,15,0.78))]" />
              <motion.div
                className="soft-scan absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-transparent via-gold/45 to-transparent"
                style={{ opacity: analyzing ? 1 : 0.5 }}
              />
              <motion.div
                className="absolute left-[10%] top-[16%] h-[30%] w-[46%] rounded-md border border-gold/55"
                animate={{ opacity: [0.35, 0.85, 0.45], scale: [0.98, 1.02, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-x-4 bottom-4 rounded-md border border-white/12 bg-background/80 p-4 backdrop-blur-2xl">
                <motion.div
                  className="flex items-start gap-3"
                  key={selectedLine}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-md border border-gold/35 bg-gold/10 text-gold">
                    <Sparkles size={20} aria-hidden="true" />
                  </span>
                  <motion.div className="min-w-0 flex-1">
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted">
                      {t.detect.analysisStream}
                    </p>
                    <p className="mt-1 truncate text-sm text-foreground">
                      {selectedLine}
                    </p>
                    {matchNote ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                        {matchNote}
                      </p>
                    ) : null}
                    <div className="mt-3 flex h-14 items-end gap-[2px]" aria-hidden="true">
                      {Array.from({ length: 26 }).map((_, i) => (
                        <span
                          key={i}
                          className="wave-bar block flex-1 rounded-full bg-gold/60"
                          style={{ height: 20 + ((i * 13) % 40), animationDelay: `${i * 0.055}s` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {archiveMatches.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-muted"
                      animate={{
                        borderColor:
                          index === lineIndex % archiveMatches.length
                            ? "rgba(200, 169, 107, 0.55)"
                            : "rgba(255,255,255,0.08)",
                      }}
                    >
                      <span className="truncate">{entry.label}</span>
                      <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.25em] text-gold">
                        {index === lineIndex % archiveMatches.length
                          ? t.detect.warming
                          : t.detect.idle}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
