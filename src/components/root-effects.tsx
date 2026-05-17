"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect } from "react";
import { AmbientParticles } from "./ambient-particles";

export function RootEffects() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });

  useEffect(() => {
    function onMove(event: MouseEvent) {
      document.documentElement.style.setProperty(
        "--cursor-x",
        `${event.clientX}px`,
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        `${event.clientY}px`,
      );
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <AmbientParticles density={40} />
      <div className="cursor-glow hidden lg:block" aria-hidden="true" />
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold/5 via-gold to-bronze"
        style={{ scaleX }}
        aria-hidden="true"
      />
    </>
  );
}
