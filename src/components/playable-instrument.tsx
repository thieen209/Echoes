"use client";

import { useAuth } from "@/hooks/useAuth";
import type { Instrument, InstrumentNote } from "@/lib/instruments";
import { audioEngine } from "@/lib/audio-engine";
import { InstrumentVisualizer } from "@/lib/instrument-visualizer";
import { useLocale } from "@/lib/i18n/locale-context";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Maximize2, Mic, Minimize2, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type PlayableInstrumentProps = {
  instrument: Instrument;
};

export function PlayableInstrument({ instrument }: PlayableInstrumentProps) {
  const { requireAuth, user } = useAuth();
  const { t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<InstrumentVisualizer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [bend, setBend] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [spectrumPhase, setSpectrumPhase] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const amplitudeRef = useRef(0);
  const ampFrameRef = useRef(0);

  const typeLabels = t.playable.types[instrument.playableType] ?? {
    title: t.playable.interface,
    subtitle: "",
  };

  // Initialize canvas visualizer
  useEffect(() => {
    if (!canvasRef.current) return;
    const viz = new InstrumentVisualizer(canvasRef.current, instrument.playableType);
    vizRef.current = viz;

    const handleResize = () => viz.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      viz.destroy();
      vizRef.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, [instrument.playableType]);

  // Amplitude tracking loop (throttled state updates)
  useEffect(() => {
    let frameCount = 0;
    const tick = () => {
      const a = audioEngine.getAmplitude();
      const mic = audioEngine.getMicAmplitude();
      const combined = Math.max(a, mic * 0.45);
      amplitudeRef.current = a;
      vizRef.current?.setAmplitude(combined);
      // Only update React state every 3rd frame to reduce re-renders
      frameCount++;
      if (frameCount % 3 === 0) {
        setAmplitude(combined);
        setMicActive(audioEngine.isMicActive());
        setSpectrumPhase((phase) => (phase + 0.36) % (Math.PI * 2));
      }
      ampFrameRef.current = requestAnimationFrame(tick);
    };
    ampFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ampFrameRef.current);
  }, []);

  // Fullscreen handling — lock body scroll + prevent touch scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };

    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.position = "fixed";
      document.body.style.inset = "0";
      document.body.style.width = "100%";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.position = "";
      document.body.style.inset = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.position = "";
      document.body.style.inset = "";
      document.body.style.width = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isFullscreen]);

  // Resize canvas when fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => vizRef.current?.resize(), 80);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const playNote = useCallback(
    (note: InstrumentNote, index: number, normX?: number, normY?: number) => {
      const play = () => {
        audioEngine.playNote({
          frequency: note.frequency,
          timbre: instrument.playableType,
          velocity: 0.85,
          bendMultiplier: instrument.playableType === "single-string" ? bend : 1,
        });
        vizRef.current?.triggerNote(index, normX, normY);
        setActiveNote(note.label);
        setTimeout(() => setActiveNote(null), 600);
      };
      requireAuth(play);
    },
    [instrument, bend, requireAuth],
  );

  const handleNoteClick = useCallback(
    (note: InstrumentNote, index: number, e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).closest("[data-play-area]")?.getBoundingClientRect();
      if (rect) {
        const normX = (e.clientX - rect.left) / rect.width;
        const normY = (e.clientY - rect.top) / rect.height;
        playNote(note, index, normX, normY);
      } else {
        playNote(note, index);
      }
    },
    [playNote],
  );

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-[100] flex flex-col bg-[#08090b]"
    : "relative";

  return (
    <motion.div
      ref={containerRef}
      className={containerClasses}
      layout
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Fullscreen backdrop */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[-1] bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <section
        className={`relative overflow-hidden rounded-xl border border-white/[0.08] bg-[rgba(14,15,18,0.85)] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${
          isFullscreen ? "flex flex-1 flex-col" : ""
        }`}
      >
        {/* Header */}
        <div className={`relative z-20 flex items-start justify-between ${isFullscreen ? "px-6 pt-6 sm:px-8 sm:pt-8" : "px-5 pt-5 sm:px-6 sm:pt-6"}`}>
          <div>
            <motion.p
              className="text-[0.65rem] font-medium uppercase tracking-[0.4em] text-gold/80"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t.playable.interface}
            </motion.p>
            <motion.h2
              className="font-display mt-2 text-xl text-foreground sm:text-2xl lg:text-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {typeLabels.title}
            </motion.h2>
            <motion.p
              className="mt-2 max-w-md text-xs leading-5 text-muted/80 sm:text-sm sm:leading-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {typeLabels.subtitle}
            </motion.p>
          </div>
          <div className="flex items-center gap-2">
            {isFullscreen && (
              <motion.button
                type="button"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-widest text-muted backdrop-blur-md transition hover:border-gold/40 hover:text-foreground"
                onClick={() => setIsFullscreen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <X size={14} />
                Đóng
              </motion.button>
            )}
            <motion.button
              type="button"
              className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition hover:border-gold/40 hover:text-gold"
              onClick={() => setIsFullscreen((v) => !v)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isFullscreen ? t.playable.exitFullscreen : t.playable.fullscreen}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </motion.button>
          </div>
        </div>

        {/* Canvas + Interactive layer */}
        <div
          className={`relative ${isFullscreen ? "flex-1" : "mt-4"}`}
          data-play-area
          style={{ minHeight: isFullscreen ? undefined : 300 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ touchAction: "none" }}
          />

          {/* Instrument-specific interactive overlays */}
          <div className={`relative z-10 flex h-full min-h-[inherit] flex-col transition-all duration-700 ${!user ? "blur-[3px] opacity-50 pointer-events-none" : ""}`}>
            {instrument.playableType === "single-string" && (
              <SingleStringUI
                instrument={instrument}
                bend={bend}
                setBend={setBend}
                activeNote={activeNote}
                onPlay={handleNoteClick}
                isFullscreen={isFullscreen}
              />
            )}
            {instrument.playableType === "horizontal-strings" && (
              <HorizontalStringsUI
                instrument={instrument}
                activeNote={activeNote}
                onPlay={handleNoteClick}
                isFullscreen={isFullscreen}
              />
            )}
            {instrument.playableType === "bamboo-bars" && (
              <BambooBarsUI
                instrument={instrument}
                activeNote={activeNote}
                onPlay={handleNoteClick}
                isFullscreen={isFullscreen}
              />
            )}
            {instrument.playableType === "minimal-pluck" && (
              <MinimalPluckUI
                instrument={instrument}
                activeNote={activeNote}
                onPlay={handleNoteClick}
                isFullscreen={isFullscreen}
              />
            )}
            {instrument.playableType === "resonant-notes" && (
              <ResonantNotesUI
                instrument={instrument}
                activeNote={activeNote}
                onPlay={handleNoteClick}
                isFullscreen={isFullscreen}
              />
            )}
          </div>

          {/* Locked State Overlay */}
          {!user && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[1px]">
              <motion.button
                onClick={() => requireAuth(() => {})}
                className="group flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="grid size-12 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold shadow-[0_0_30px_rgba(200,169,107,0.2)] transition-all group-hover:border-gold/60 group-hover:bg-gold/20 group-hover:shadow-[0_0_40px_rgba(200,169,107,0.3)]">
                  <Lock size={18} />
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold/90 transition-colors group-hover:text-gold">Mở khóa tương tác</p>
                  <p className="mt-1 text-[0.7rem] text-white/50 transition-colors group-hover:text-white/70">Đăng nhập để trải nghiệm âm thanh</p>
                </div>
              </motion.button>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className={`relative z-20 border-t border-white/[0.06] ${isFullscreen ? "px-6 py-3 sm:px-8 sm:py-4" : "px-5 py-3 sm:px-6 sm:py-4"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="size-2 rounded-full"
                animate={{
                  backgroundColor: amplitude > 0.05
                    ? "rgba(200,169,107,0.9)"
                    : "rgba(200,169,107,0.25)",
                  boxShadow: amplitude > 0.05
                    ? "0 0 8px rgba(200,169,107,0.4)"
                    : "0 0 0 rgba(0,0,0,0)",
                }}
              />
              <span className="text-[0.6rem] uppercase tracking-[0.35em] text-muted">
                {amplitude > 0.05 ? t.playable.resonating : t.playable.awaiting}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.3em] text-muted/60">
              <button
                type="button"
                className={`flex items-center gap-2 transition ${
                  micActive ? "text-gold" : "hover:text-gold/70"
                }`}
                onClick={() => void audioEngine.enableMicrophone()}
                title="Bật microphone"
              >
                <Mic size={12} aria-hidden="true" />
                <span className="hidden sm:inline">{micActive ? "MIC ON" : "MIC OFF"}</span>
              </button>
              <div className="flex items-center gap-2">
                <Volume2 size={12} aria-hidden="true" />
                <span className="hidden sm:inline">{t.playable.webAudio}</span>
              </div>
            </div>
          </div>
          {/* Mini spectrum */}
          <div className="mt-2 flex h-6 items-end gap-[2px] sm:mt-3 sm:h-8">
            {Array.from({ length: 32 }).map((_, i) => {
              const h = Math.max(
                2,
                (Math.sin(spectrumPhase + i * 0.4) * 0.15 + 0.15 + amplitude * 0.7) * 24,
              );
              return (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full bg-gold/35"
                  animate={{ height: h }}
                  transition={{ duration: 0.1 }}
                />
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

/* ──────────────────────────────────────────
   Instrument-specific UI overlays
   ────────────────────────────────────────── */

interface InstrumentUIProps {
  instrument: Instrument;
  activeNote: string | null;
  onPlay: (note: InstrumentNote, index: number, e: React.MouseEvent) => void;
  isFullscreen: boolean;
}

/* ── Đàn Bầu ── */
function SingleStringUI({
  instrument,
  bend,
  setBend,
  activeNote,
  onPlay,
  isFullscreen,
}: InstrumentUIProps & { bend: number; setBend: (v: number) => void }) {
  const { t } = useLocale();
  const baseNote = instrument.notes[2] ?? instrument.notes[0];

  return (
    <div className={`flex flex-1 flex-col items-center justify-center gap-5 sm:gap-6 ${isFullscreen ? "px-8 sm:px-12" : "px-5 sm:px-6"}`}>
      {/* Pitch rod indicator */}
      <div className="relative h-1 w-full max-w-lg">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <motion.div
          className="absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-gold/50 bg-gold/15 text-gold sm:size-10"
          animate={{
            left: `${Math.min(Math.max((bend - 0.75) * 200, 0), 100)}%`,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Volume2 size={14} />
        </motion.div>
      </div>

      <div className="w-full max-w-lg">
        <input
          type="range"
          min="0.75"
          max="1.25"
          step="0.005"
          value={bend}
          onChange={(e) => setBend(Number(e.target.value))}
          className="playable-range w-full"
          aria-label="Pitch bend"
        />
        <div className="mt-2 flex justify-between text-[0.6rem] uppercase tracking-[0.3em] text-muted/50">
          <span>−25¢</span>
          <span className="text-gold/70">{((bend - 1) * 100).toFixed(0)}¢</span>
          <span>+25¢</span>
        </div>
      </div>

      <motion.button
        type="button"
        className="group relative overflow-hidden rounded-full border border-gold/40 bg-gold/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-foreground transition-all hover:border-gold/70 hover:bg-gold/20 sm:px-10 sm:py-3.5"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={(e) => onPlay(baseNote, 0, e)}
      >
        <span className="relative z-10">{t.playable.pluckHarmonic}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/15 to-gold/0"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.button>
    </div>
  );
}

/* ── Đàn Tranh ── */
function HorizontalStringsUI({ instrument, activeNote, onPlay, isFullscreen }: InstrumentUIProps) {
  return (
    <div className={`flex flex-1 flex-col justify-center gap-1.5 sm:gap-2 ${isFullscreen ? "px-8 py-4 sm:px-10 sm:py-6" : "px-4 py-3 sm:px-6 sm:py-4"}`}>
      {instrument.notes.map((note, index) => (
        <motion.button
          key={`${note.label}-${index}`}
          type="button"
          className="group relative flex h-10 items-center gap-3 rounded-lg border border-transparent px-3 text-left transition-all hover:border-[rgba(127,190,120,0.3)] hover:bg-[rgba(127,190,120,0.06)] sm:h-12 sm:gap-4 sm:px-4"
          whileTap={{ scale: 0.99 }}
          onClick={(e) => onPlay(note, index, e)}
        >
          <span className="w-7 text-xs text-muted/50 tabular-nums sm:w-8">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(127,190,120,0.15)] via-[rgba(127,190,120,0.5)] to-[rgba(127,190,120,0.15)] transition-all group-hover:via-[rgba(127,190,120,0.8)]" />
          <span className="w-8 text-right text-xs text-muted/60 sm:w-10">{note.label}</span>
          <motion.span
            className="size-2 rounded-full sm:size-2.5"
            animate={{
              backgroundColor: activeNote === note.label ? "rgba(127,190,120,1)" : "rgba(127,190,120,0.2)",
              boxShadow: activeNote === note.label ? "0 0 10px rgba(127,190,120,0.5)" : "none",
              scale: activeNote === note.label ? 1.3 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          />
        </motion.button>
      ))}
    </div>
  );
}

/* ── T'rưng ── */
function BambooBarsUI({ instrument, activeNote, onPlay, isFullscreen }: InstrumentUIProps) {
  return (
    <div className={`flex flex-1 items-end justify-center gap-2 sm:gap-3 ${isFullscreen ? "px-6 pb-8 sm:px-10 sm:pb-10" : "px-4 pb-5 sm:px-6 sm:pb-6"}`}>
      {instrument.notes.map((note, index) => {
        const heightPercent = 35 + index * 11;
        const isActive = activeNote === note.label;
        return (
          <motion.button
            key={`${note.label}-${index}`}
            type="button"
            className="group relative flex w-full min-w-0 max-w-[4rem] flex-col items-center justify-end overflow-hidden rounded-t-md border border-transparent pb-2 transition-all hover:border-[rgba(184,134,11,0.4)] sm:min-w-[2rem] sm:pb-3"
            style={{ height: `${heightPercent}%` }}
            animate={{
              borderColor: isActive
                ? "rgba(218,165,32,0.75)"
                : "rgba(255,255,255,0)",
              boxShadow: isActive
                ? "0 0 20px rgba(218,165,32,0.25)"
                : "0 0 0 rgba(0,0,0,0)",
            }}
            whileHover={{ y: -3 }}
            whileTap={{ scaleY: 0.96, transition: { duration: 0.05 } }}
            onClick={(e) => onPlay(note, index, e)}
          >
            <motion.div
              className="absolute inset-0 rounded-t-md opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                background: "radial-gradient(ellipse at top center, rgba(184,134,11,0.15), transparent 70%)",
              }}
            />
            <span className="relative text-[0.65rem] font-medium text-muted/60 group-hover:text-[#daa520] sm:text-xs">
              {note.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── Shamisen ── */
function MinimalPluckUI({ instrument, activeNote, onPlay, isFullscreen }: InstrumentUIProps) {
  return (
    <div className={`flex flex-1 flex-col justify-center gap-4 sm:gap-5 ${isFullscreen ? "px-8 py-6 sm:px-12 sm:py-8" : "px-5 py-3 sm:px-6 sm:py-4"}`}>
      {instrument.notes.map((note, index) => (
        <motion.button
          key={`${note.label}-${index}`}
          type="button"
          className="group relative flex h-14 items-center gap-4 rounded-lg border border-transparent px-4 transition-all hover:border-white/15 hover:bg-white/[0.03] sm:h-16 sm:gap-5 sm:px-5"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98, transition: { duration: 0.04 } }}
          onClick={(e) => onPlay(note, index, e)}
        >
          <span className="w-5 font-mono text-xs text-muted/30 sm:w-6">{index + 1}</span>
          <div className="relative flex-1">
            <motion.div
              className="h-[2px] w-full origin-left"
              animate={{
                backgroundColor: activeNote === note.label ? "rgba(196,30,58,0.9)" : "rgba(220,220,225,0.3)",
                boxShadow: activeNote === note.label ? "0 0 15px rgba(196,30,58,0.3)" : "none",
                scaleX: activeNote === note.label ? [1, 1.02, 1] : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>
          <span className="w-7 text-right text-xs text-muted/50 sm:w-8">{note.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ── Sitar ── */
function ResonantNotesUI({ instrument, activeNote, onPlay }: InstrumentUIProps) {
  return (
    <div className="flex flex-1 items-center justify-center py-4 sm:py-6">
      <div className="relative aspect-square w-[min(85%,380px)] sm:w-[min(80%,400px)]">
        {/* Concentric rings */}
        {[0.9, 0.6, 0.3].map((scale) => (
          <motion.div
            key={scale}
            className="pointer-events-none absolute inset-0 rounded-full border border-[rgba(232,168,56,0.08)]"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
            animate={{
              borderColor: activeNote
                ? `rgba(232,168,56,${0.12 * scale})`
                : `rgba(232,168,56,${0.06 * scale})`,
            }}
          />
        ))}
        {/* Note nodes */}
        {instrument.notes.map((note, index) => {
          const angle = (index / instrument.notes.length) * Math.PI * 2 - Math.PI / 2;
          const isActive = activeNote === note.label;

          return (
            <motion.button
              key={`${note.label}-${index}`}
              type="button"
              className="absolute grid place-items-center rounded-full border transition-colors"
              style={{
                left: `calc(50% + ${Math.cos(angle) * 37}% - 1rem)`,
                top: `calc(50% + ${Math.sin(angle) * 37}% - 1rem)`,
                width: "2rem",
                height: "2rem",
              }}
              animate={{
                borderColor: isActive ? "rgba(232,168,56,0.7)" : "rgba(232,168,56,0.2)",
                backgroundColor: isActive ? "rgba(232,168,56,0.2)" : "rgba(232,168,56,0.05)",
                boxShadow: isActive
                  ? "0 0 20px rgba(232,168,56,0.3)"
                  : "0 0 0 rgba(0,0,0,0)",
                scale: isActive ? 1.12 : 1,
              }}
              whileHover={{ scale: 1.06, borderColor: "rgba(232,168,56,0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => onPlay(note, index, e)}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className={`text-xs font-medium ${isActive ? "text-[#e8a838]" : "text-muted/60"}`}>
                {note.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
