"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Particle = {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

export function AmbientParticles({
  density = 48,
  className = "",
}: {
  density?: number;
  className?: string;
}) {
  const particles = useMemo(() => {
    return Array.from({ length: density }, (_, index) => {
      const id = index;
      return {
        id,
        x: `${(index * 37) % 100}%`,
        y: `${(index * 53) % 100}%`,
        size: 1 + (index % 3),
        duration: 14 + (index % 9),
        delay: (index % 12) * 0.4,
        opacity: 0.08 + (index % 5) * 0.035,
      } satisfies Particle;
    });
  }, [density]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[5] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-foreground"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [0, -32, 8, -18, 0],
            x: [0, 12, -8, 6, 0],
            opacity: [
              particle.opacity,
              particle.opacity * 1.8,
              particle.opacity * 0.6,
              particle.opacity,
            ],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(200,169,107,0.07),transparent_55%)]" />
    </div>
  );
}
