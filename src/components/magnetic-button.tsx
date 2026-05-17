"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
import { useRef } from "react";

type MagneticButtonProps = ComponentProps<typeof motion.button> & {
  children: ReactNode;
  strength?: number;
};

export function MagneticButton({
  children,
  className = "",
  strength = 0.22,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.35 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(200,169,107,0.22), transparent 55%)`;

  function handleMove(event: React.MouseEvent<HTMLButtonElement>) {
    const node = ref.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: spotlight }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
