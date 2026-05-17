"use client";

import type { Instrument } from "@/lib/instruments";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type InstrumentHeroProps = {
  instrument: Instrument;
};

export function InstrumentHero({ instrument }: InstrumentHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative min-h-[82vh] overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-36"
    >
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src={instrument.heroImage}
          alt=""
          fill
          priority
          className="object-cover opacity-[0.5]"
          sizes="100vw"
        />
        <div className="image-vignette" />
      </motion.div>
      <motion.div
        className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-end"
        style={{ y }}
      >
        <p className="text-xs uppercase tracking-[0.4em] text-gold">
          {instrument.originCountry}
        </p>
        <h1 className="font-epic mt-6 max-w-5xl text-6xl leading-[0.92] text-foreground sm:text-8xl">
          {instrument.name}
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-9 text-muted">
          {instrument.summary}
        </p>
      </motion.div>
    </section>
  );
}
