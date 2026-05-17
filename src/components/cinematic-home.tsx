"use client";

import { HomeScanSection } from "@/components/home-scan-section";
import { Reveal } from "@/components/motion-reveal";
import { useLocale } from "@/lib/i18n/locale-context";
import { instruments, type Instrument } from "@/lib/instruments";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Camera, Radar, Sparkles, Waves } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Ambient Particles (replaces decorative waveform) ── */
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    // Create floating particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      drift: number;
      phase: number;
      opacity: number;
    }[] = [];

    const count = Math.min(35, Math.floor((w * h) / 25000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 0.5 + Math.random() * 2,
        speed: 0.05 + Math.random() * 0.15,
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.15 + Math.random() * 0.35,
      });
    }

    let time = 0;
    function animate() {
      if (!ctx) return;
      time += 0.008;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(time + p.phase) * p.drift;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const breathe = Math.sin(time * 1.5 + p.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,107,${p.opacity * breathe})`;
        ctx.fill();
      }

      // Subtle light distortion (two slow glows)
      const glow1X = w * 0.3 + Math.sin(time * 0.4) * w * 0.1;
      const glow1Y = h * 0.4 + Math.cos(time * 0.3) * h * 0.08;
      const g1 = ctx.createRadialGradient(glow1X, glow1Y, 0, glow1X, glow1Y, w * 0.3);
      g1.addColorStop(0, "rgba(200,169,107,0.03)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const glow2X = w * 0.7 + Math.sin(time * 0.25 + 2) * w * 0.08;
      const glow2Y = h * 0.6 + Math.cos(time * 0.2 + 1) * h * 0.06;
      const g2 = ctx.createRadialGradient(glow2X, glow2Y, 0, glow2X, glow2Y, w * 0.25);
      g2.addColorStop(0, "rgba(94,112,87,0.025)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      aria-hidden="true"
    />
  );
}

/* ── Hero Interactive Core (Replaces Logo) ── */
function HeroCoreAnimation() {
  return (
    <div className="relative flex size-48 items-center justify-center sm:size-64 lg:size-80">
      {/* Outer rotating dashed ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-gold/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner counter-rotating ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-white/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulsing core glow */}
      <motion.div
        className="absolute inset-10 rounded-full bg-gold/10 blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center symbol / element */}
      <div className="relative flex size-24 items-center justify-center rounded-full border border-gold/40 bg-black/40 backdrop-blur-md">
        <motion.div
          className="flex h-8 items-end gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-gold/80"
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Orbiting particle */}
      <motion.div
        className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_rgba(200,169,107,0.8)]"
        animate={{
          rotate: 360,
          originX: "100px", // Approximate radius, adjust if needed
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "12rem center" }}
      />
    </div>
  );
}

function ExhibitSection({
  instrument,
  index,
}: {
  instrument: Instrument;
  index: number;
}) {
  const { t } = useLocale();
  const reversed = index % 2 === 1;
  const accents = [
    "from-clay/25 via-transparent to-transparent",
    "from-sage/20 via-transparent to-transparent",
    "from-bronze/25 via-transparent to-transparent",
    "from-gold/15 via-transparent to-transparent",
    "from-clay/20 via-sage/10 to-transparent",
  ];

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accents[index % accents.length]}`}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <motion.div
          className={`relative ${reversed ? "lg:order-2" : ""}`}
          initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <Image
              src={instrument.heroImage}
              alt={instrument.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
            <div className="image-vignette" />
            <motion.div
              className="absolute inset-x-10 bottom-10 rounded-md border border-gold/25 bg-background/55 p-5 backdrop-blur-xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                {t.home.exhibitSignal}
              </p>
              <div className="mt-3 flex h-14 items-end gap-[2px]" aria-hidden="true">
                {Array.from({ length: 26 }).map((_, i) => (
                  <span
                    key={i}
                    className="wave-bar block flex-1 rounded-full bg-gold/60"
                    style={{ height: 28 + ((i * 17) % 48), animationDelay: `${i * 0.055}s` }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className={reversed ? "lg:order-1" : ""}>
          <p className="text-xs uppercase tracking-[0.4em] text-muted">
            {instrument.originCountry}
          </p>
          <h3 className="font-epic mt-4 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
            {instrument.name}
          </h3>
          <p className="mt-8 max-w-xl text-lg leading-9 text-muted">
            {instrument.summary}
          </p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-muted/90">
            {instrument.history.slice(0, 220)}
            {instrument.history.length > 220 ? "…" : ""}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              className="museum-button px-8 py-3 text-sm uppercase tracking-[0.2em]"
              href={`/instrument/${instrument.id}`}
            >
              {t.home.enterExhibit}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              className="museum-button border-white/15 bg-white/[0.04] px-6 py-3 text-sm uppercase tracking-[0.18em]"
              href="/upload"
            >
              {t.home.matchFromImage}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CinematicHome() {
  const { t } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div className="relative z-10">
      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] overflow-hidden"
      >
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale }}
        >
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-[0.5]"
            sizes="100vw"
          />
          <div className="image-vignette" />
        </motion.div>

        {/* Ambient particles instead of waveform */}
        <HeroParticles />

        <motion.div
          className="relative z-[3] mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-40"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.45em] text-gold">
                <Waves size={15} aria-hidden="true" />
                {t.hero.kicker}
              </p>
              <h1 className="hero-title font-epic mt-8 leading-[0.92] text-foreground">
                {t.hero.title}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-9 text-muted sm:text-xl">
                {t.hero.body}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 lg:items-end">
              <HeroCoreAnimation />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link
                className="museum-button inline-flex w-full px-10 py-4 text-sm uppercase tracking-[0.25em] sm:w-auto"
                href="/#scan"
              >
                <Camera size={18} aria-hidden="true" />
                {t.hero.ctaScan}
              </Link>
            </motion.div>
            <Link
              className="museum-button border-white/18 bg-white/[0.04] px-8 py-4 text-sm uppercase tracking-[0.22em]"
              href="/archive"
            >
              {t.hero.ctaArchive}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Scan Section (moved up per flow request) ── */}
      <HomeScanSection />

      {/* ── How Echoes Works ── */}
      <section className="border-y border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(200,169,107,0.08),transparent_45%)] py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">
              {t.home.howKicker}
            </p>
            <h2 className="font-display mt-6 max-w-4xl text-5xl text-foreground sm:text-6xl">
              {t.home.howTitle}
            </h2>
          </Reveal>
          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {t.home.steps.map((step, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="relative h-full overflow-hidden rounded-sm border border-white/10 bg-black/25 p-8">
                  <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent opacity-40" />
                  <div className="relative">
                    <span className="text-xs uppercase tracking-[0.5em] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-epic mt-6 text-4xl text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-5 leading-8 text-muted">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Immersive Scroll / Contemplation ── */}
      <section className="relative overflow-hidden py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,169,107,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-gold">
                {t.home.immersiveScroll}
              </p>
              <h2 className="font-display mt-6 text-5xl leading-[1.02] text-foreground sm:text-6xl">
                {t.home.corridorTitle}
              </h2>
            </motion.div>
            <div className="space-y-12">
              {t.home.quotes.map((quote, index) => (
                <Reveal key={index} delay={index * 0.12}>
                  <blockquote className="font-epic text-3xl leading-snug text-foreground/95 sm:text-4xl">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="mt-24 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {instruments.map((instrument, index) => (
              <Reveal key={instrument.id} delay={index * 0.08}>
                <motion.div
                  className="group relative overflow-hidden rounded-sm border border-white/10 bg-surface/40"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <div className="relative h-56">
                    <Image
                      src={instrument.heroImage}
                      alt=""
                      fill
                      className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <p className="absolute bottom-5 left-5 font-display text-2xl text-foreground">
                      {instrument.name}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Analysis Theater ── */}
      <section className="relative py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(12,13,15,0.9),rgba(12,13,15,0.65)),url('/images/instruments/sitar.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
                <Radar size={16} aria-hidden="true" />
                {t.home.analysisTheater}
              </p>
              <h2 className="font-display mt-6 text-5xl leading-tight text-foreground sm:text-6xl">
                {t.home.analysisTitle}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                {t.home.analysisBody}
              </p>
              <Link
                className="museum-button mt-10 inline-flex px-8 py-3 text-sm uppercase tracking-[0.22em]"
                href="/upload"
              >
                {t.home.launchScan}
                <Sparkles size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-sm border border-white/15 bg-background/70 p-1 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
              <div className="relative aspect-[16/11] overflow-hidden rounded-sm bg-black/40">
                <Image
                  src="/images/instruments/dan-tranh.webp"
                  alt=""
                  fill
                  className="object-cover opacity-70"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/80" />
                <div className="soft-scan absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
                <div className="absolute left-6 top-6 rounded border border-gold/40 bg-background/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-gold">
                  {t.home.liveTriage}
                </div>
                <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-xs text-muted">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-400/90" />
                  Gemini Vision / 2.5
                </div>
                <div className="absolute inset-8 rounded-md border border-dashed border-gold/35" />
                <div className="absolute bottom-6 left-6 right-6 rounded-md border border-white/10 bg-background/80 p-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                    {t.home.analysisLine}
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    {t.home.detectingResonance}
                  </p>
                  <div className="mt-3 flex h-12 items-end gap-[2px]" aria-hidden="true">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span
                        key={i}
                        className="wave-bar block flex-1 rounded-full bg-gold/60"
                        style={{ height: 20 + ((i * 13) % 36), animationDelay: `${i * 0.055}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Instrument Exhibits ── */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        {instruments.map((instrument, index) => (
          <ExhibitSection
            key={instrument.id}
            instrument={instrument}
            index={index}
          />
        ))}
      </div>

      {/* ── Tactile Room Preview ── */}
      <section className="relative overflow-hidden py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(94,112,87,0.2),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">
              {t.home.tactileRoom}
            </p>
            <h2 className="font-display mt-6 text-5xl leading-tight text-foreground sm:text-6xl">
              {t.home.tactileTitle}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              {t.home.tactileBody}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="museum-button px-8 py-3 text-sm uppercase tracking-[0.2em]" href="/instrument/trung">
                {t.home.tryTrung}
              </Link>
              <Link
                className="museum-button border-white/15 bg-white/[0.04] px-8 py-3 text-sm uppercase tracking-[0.2em]"
                href="/instrument/sitar"
              >
                {t.home.openSitar}
              </Link>
            </div>
          </div>
          <Reveal>
            <div className="museum-card relative overflow-hidden p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
                <span>{t.home.resonantPreview}</span>
                <span>{t.home.browserAudio}</span>
              </div>
              <div className="mt-8 flex h-48 flex-col justify-end rounded-md border border-white/10 bg-black/30 p-4">
                <div className="flex h-20 w-full items-end justify-between gap-1" aria-hidden="true">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className="wave-bar block flex-1 rounded-full bg-gold/60"
                      style={{ height: 28 + ((i * 17) % 58), animationDelay: `${i * 0.055}s` }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-muted">
                {t.home.previewNote}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
