"use client";

import { EchoesLogoMark } from "@/components/echoes-logo";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function AuthChrome({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Record<string, number>[]>([]);

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 15 }).map(() => ({
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.1,
        animY: -(Math.random() * 200 + 100),
        animX: (Math.random() - 0.5) * 100,
        animOp: Math.random() * 0.8,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 10,
      }))
    );
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* 1. Base Darkness & Volumetric Fog Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(30,22,12,0.8),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(15,10,5,0.9),transparent_60%)] mix-blend-multiply" />
      
      {/* 2. Slow Resonance Waves (SVG) */}
      <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8A96B" stopOpacity="0" />
              <stop offset="50%" stopColor="#C8A96B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C8A96B" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d="M-200,500 C100,600 300,200 600,400 C900,600 1100,300 1500,450"
            fill="none"
            stroke="url(#wave-grad)"
            strokeWidth="1.5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 4, ease: "easeOut" }}
          />
          <motion.path
            d="M-200,550 C150,700 400,100 800,350 C1100,500 1300,200 1600,400"
            fill="none"
            stroke="url(#wave-grad)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 5, ease: "easeOut", delay: 1 }}
          />
        </svg>
      </div>

      {/* 3. Ambient Glow Accents */}
      <motion.div
        className="pointer-events-none absolute -left-[20%] top-[10%] h-[800px] w-[800px] rounded-full bg-[#C8A96B]/5 blur-[120px]"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-[#8B5A2B]/10 blur-[100px]"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* 4. Drifting Dust Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {mounted && particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#C8A96B]"
            style={{
              width: p.size + "px",
              height: p.size + "px",
              left: p.left + "%",
              top: p.top + "%",
              opacity: p.opacity,
            }}
            animate={{
              y: [0, p.animY],
              x: [0, p.animX],
              opacity: [0, p.animOp, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Foreground Noise Texture */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />

      {/* Content Layout */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1300px] flex-col px-6 py-20 sm:px-12 lg:flex-row lg:items-center lg:gap-24">
        
        {/* Left Side: Immersive Storytelling Scene */}
        <div className="mb-16 flex-1 lg:mb-0 relative lg:pr-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="inline-block relative">
              <EchoesLogoMark size={72} />
              <motion.div 
                className="absolute inset-0 bg-[#C8A96B] blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 2, delay: 1 }}
              />
            </div>
            
            <p className="mt-14 text-[10px] sm:text-xs uppercase tracking-[0.5em] text-[#C8A96B]/80 font-medium">
              Cổng không gian lưu trữ
            </p>
            
            <h1 className="font-epic mt-6 text-[3rem] leading-[1.1] text-white/95 sm:text-[4.5rem] lg:text-[5rem] drop-shadow-2xl">
              {title}
            </h1>
            
            <p className="mt-8 text-base sm:text-lg leading-relaxed text-white/50 max-w-lg font-light tracking-wide">
              {subtitle}
            </p>

            <motion.div 
              className="mt-12 h-[1px] w-24 bg-gradient-to-r from-[#C8A96B]/60 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1.5, delay: 1 }}
            />
          </motion.div>
        </div>

        {/* Right Side: Sacred Interface */}
        <motion.div 
          className="w-full max-w-md lg:w-[480px] lg:shrink-0 mx-auto"
          initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
