import type { PlayableType } from "./instruments";

interface Theme {
  primary: string;
  glow: string;
  particleColors: string[];
}

const THEMES: Record<PlayableType, Theme> = {
  "single-string": {
    primary: "rgba(200,169,107,1)",
    glow: "rgba(200,169,107,0.35)",
    particleColors: ["#c8a96b", "#e8d5a8", "#f4ecdf", "#dcc48e"],
  },
  "horizontal-strings": {
    primary: "rgba(127,190,120,1)",
    glow: "rgba(127,190,120,0.3)",
    particleColors: ["#7fbe78", "#a8d99c", "#c8e8c0", "#5e9e56"],
  },
  "bamboo-bars": {
    primary: "rgba(184,134,11,1)",
    glow: "rgba(184,134,11,0.3)",
    particleColors: ["#b8860b", "#daa520", "#cd853f", "#8b7355"],
  },
  "minimal-pluck": {
    primary: "rgba(220,220,225,1)",
    glow: "rgba(220,220,225,0.25)",
    particleColors: ["#e0e0e5", "#ffffff", "#c41e3a", "#f0e8e0"],
  },
  "resonant-notes": {
    primary: "rgba(232,168,56,1)",
    glow: "rgba(232,168,56,0.3)",
    particleColors: ["#e8a838", "#f4c86c", "#c87830", "#9b59b6"],
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  color: string;
}

interface StringState {
  points: number[];
  velocity: number[];
  damping: number;
  active: boolean;
  brightness: number;
}

export class InstrumentVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private type: PlayableType;
  private theme: Theme;
  private particles: Particle[] = [];
  private ripples: Ripple[] = [];
  private strings: StringState[] = [];
  private animId = 0;
  private time = 0;
  private amplitude = 0;
  private targetAmplitude = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement, type: PlayableType) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.type = type;
    this.theme = THEMES[type];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
    this.initStrings();
    this.animate();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private initStrings() {
    this.strings = [];
    const count =
      this.type === "single-string" ? 1 :
      this.type === "horizontal-strings" ? 6 :
      this.type === "bamboo-bars" ? 6 :
      this.type === "minimal-pluck" ? 3 :
      6;
    const segments = 60;
    for (let i = 0; i < count; i++) {
      this.strings.push({
        points: new Array(segments).fill(0),
        velocity: new Array(segments).fill(0),
        damping: 0.992,
        active: false,
        brightness: 0,
      });
    }
  }

  setAmplitude(a: number) {
    this.targetAmplitude = a;
  }

  triggerNote(noteIndex: number, normX?: number, normY?: number) {
    const x = (normX ?? 0.5) * this.width;
    const y = (normY ?? 0.5) * this.height;

    // Pluck string
    if (noteIndex < this.strings.length) {
      const s = this.strings[noteIndex];
      const mid = Math.floor(s.points.length / 2);
      const spread = Math.floor(s.points.length * 0.3);
      for (let i = -spread; i <= spread; i++) {
        const idx = mid + i;
        if (idx >= 0 && idx < s.points.length) {
          const factor = 1 - Math.abs(i) / spread;
          s.points[idx] = factor * factor * (12 + Math.random() * 6);
        }
      }
      s.active = true;
      s.brightness = 1;
    }

    // Spawn subtle particles (reduced from 18-30 to 6-10)
    const count = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        life: 1,
        maxLife: 35 + Math.random() * 25,
        size: 0.8 + Math.random() * 1.5,
        color: this.theme.particleColors[Math.floor(Math.random() * this.theme.particleColors.length)],
      });
    }

    // Single subtle ripple (reduced from 120-200px to 60-100px)
    this.ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: 60 + Math.random() * 40,
      life: 1,
      color: this.theme.primary,
    });

    this.targetAmplitude = 0.9;
  }

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    this.time += 0.016;
    this.amplitude += (this.targetAmplitude - this.amplitude) * 0.08;
    this.targetAmplitude *= 0.985;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    ctx.clearRect(0, 0, w, h);

    this.drawAmbientGlow(ctx, w, h);
    this.updateStrings();
    this.drawStrings(ctx, w, h);
    this.updateAndDrawParticles(ctx);
    this.updateAndDrawRipples(ctx);
    this.drawAnalyserBars(ctx, w, h);
  };

  private drawAmbientGlow(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const intensity = 0.02 + this.amplitude * 0.1;
    const r = Math.max(w, h) * 0.5;
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, r);
    grad.addColorStop(0, this.theme.glow.replace(/[\d.]+\)$/, `${intensity})`));
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle breathing ring (reduced)
    const breathe = Math.sin(this.time * 0.8) * 0.5 + 0.5;
    const ringR = Math.min(w, h) * 0.3 + breathe * 10 + this.amplitude * 15;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = this.theme.glow.replace(/[\d.]+\)$/, `${0.04 + this.amplitude * 0.06})`);
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  private updateStrings() {
    for (const s of this.strings) {
      const n = s.points.length;
      const tension = 0.18;
      for (let i = 1; i < n - 1; i++) {
        const force = (s.points[i - 1] + s.points[i + 1]) * 0.5 - s.points[i];
        s.velocity[i] += force * tension;
        s.velocity[i] *= s.damping;
      }
      for (let i = 1; i < n - 1; i++) {
        s.points[i] += s.velocity[i];
      }
      s.points[0] = 0;
      s.points[n - 1] = 0;
      s.brightness *= 0.98;

      let energy = 0;
      for (let i = 0; i < n; i++) energy += Math.abs(s.points[i]);
      if (energy < 0.05) s.active = false;
    }
  }

  private drawStrings(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (this.type === "single-string") {
      this.drawSingleString(ctx, w, h);
    } else if (this.type === "horizontal-strings") {
      this.drawHorizontalStrings(ctx, w, h);
    } else if (this.type === "bamboo-bars") {
      this.drawBambooBars(ctx, w, h);
    } else if (this.type === "minimal-pluck") {
      this.drawMinimalPluck(ctx, w, h);
    } else {
      this.drawResonantNodes(ctx, w, h);
    }
  }

  private drawSingleString(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const s = this.strings[0];
    if (!s) return;
    const y0 = h * 0.5;
    const margin = w * 0.08;
    const strW = w - margin * 2;

    if (s.brightness > 0.01) {
      ctx.shadowColor = this.theme.glow;
      ctx.shadowBlur = 12 + s.brightness * 18;
    }

    ctx.beginPath();
    ctx.moveTo(margin, y0);
    for (let i = 0; i < s.points.length; i++) {
      const x = margin + (i / (s.points.length - 1)) * strW;
      const y = y0 + s.points[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const alpha = 0.5 + s.brightness * 0.5;
    ctx.strokeStyle = this.theme.primary.replace(/[\d.]+\)$/, `${alpha})`);
    ctx.lineWidth = 1.5 + s.brightness * 0.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (const nx of [margin, margin + strW]) {
      ctx.beginPath();
      ctx.arc(nx, y0, 3 + s.brightness * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = this.theme.primary;
      ctx.fill();
    }
  }

  private drawHorizontalStrings(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const margin = w * 0.06;
    const strW = w - margin * 2;
    const gap = h / (this.strings.length + 1);

    for (let si = 0; si < this.strings.length; si++) {
      const s = this.strings[si];
      const y0 = gap * (si + 1);

      if (s.brightness > 0.01) {
        ctx.shadowColor = this.theme.glow;
        ctx.shadowBlur = 8 + s.brightness * 12;
      }
      ctx.beginPath();
      for (let i = 0; i < s.points.length; i++) {
        const x = margin + (i / (s.points.length - 1)) * strW;
        const y = y0 + s.points[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = this.theme.primary.replace(/[\d.]+\)$/, `${0.35 + s.brightness * 0.65})`);
      ctx.lineWidth = 1 + s.brightness * 0.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(margin - 4, y0, 2.5, 0, Math.PI * 2);
      ctx.arc(margin + strW + 4, y0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.theme.primary.replace(/[\d.]+\)$/, `${0.3 + s.brightness * 0.5})`);
      ctx.fill();
    }
  }

  private drawBambooBars(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const count = this.strings.length;
    const gap = w / (count + 1);
    const maxBarH = h * 0.65;

    for (let i = 0; i < count; i++) {
      const s = this.strings[i];
      const barH = maxBarH * (0.45 + (i / count) * 0.55);
      const barW = gap * 0.55;
      const x = gap * (i + 1) - barW / 2;
      const y = h - barH - h * 0.08 + (s.active ? s.points[30] * 0.3 : 0);

      const grad = ctx.createLinearGradient(x, y, x + barW, y);
      const bright = 0.3 + s.brightness * 0.35;
      grad.addColorStop(0, `rgba(184,134,11,${bright * 0.7})`);
      grad.addColorStop(0.5, `rgba(205,160,60,${bright})`);
      grad.addColorStop(1, `rgba(160,110,10,${bright * 0.6})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      const r = 4;
      ctx.roundRect(x, y, barW, barH, [r, r, 2, 2]);
      ctx.fill();

      if (s.brightness > 0.05) {
        ctx.strokeStyle = this.theme.primary.replace(/[\d.]+\)$/, `${s.brightness * 0.4})`);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.strokeStyle = `rgba(255,255,255,${0.04 + s.brightness * 0.02})`;
      ctx.lineWidth = 0.5;
      for (let g = 0; g < 3; g++) {
        const gx = x + barW * (0.25 + g * 0.25);
        ctx.beginPath();
        ctx.moveTo(gx, y + 4);
        ctx.lineTo(gx + (Math.random() - 0.5) * 2, y + barH - 4);
        ctx.stroke();
      }
    }
  }

  private drawMinimalPluck(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const margin = w * 0.1;
    const strW = w - margin * 2;
    const gap = h / (this.strings.length + 1);

    for (let si = 0; si < this.strings.length; si++) {
      const s = this.strings[si];
      const y0 = gap * (si + 1);

      if (s.brightness > 0.01) {
        ctx.shadowColor = this.type === "minimal-pluck" ? "rgba(196,30,58,0.3)" : this.theme.glow;
        ctx.shadowBlur = 6 + s.brightness * 15;
      }

      ctx.beginPath();
      for (let i = 0; i < s.points.length; i++) {
        const x = margin + (i / (s.points.length - 1)) * strW;
        const y = y0 + s.points[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = s.brightness > 0.3
        ? `rgba(196,30,58,${0.6 + s.brightness * 0.4})`
        : this.theme.primary.replace(/[\d.]+\)$/, `${0.3 + s.brightness * 0.7})`);
      ctx.lineWidth = 2 + s.brightness * 0.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = `rgba(255,255,255,${0.2 + s.brightness * 0.3})`;
      ctx.font = "11px monospace";
      ctx.fillText(`${si + 1}`, margin - 20, y0 + 4);
    }
  }

  private drawResonantNodes(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.32;

    for (let i = 0; i < this.strings.length; i++) {
      const s = this.strings[i];
      const angle = (i / this.strings.length) * Math.PI * 2 - Math.PI / 2;
      const nx = cx + Math.cos(angle) * radius;
      const ny = cy + Math.sin(angle) * radius;
      const nodeR = 18 + s.brightness * 6;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = this.theme.primary.replace(/[\d.]+\)$/, `${0.06 + s.brightness * 0.15})`);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      if (s.brightness > 0.05) {
        const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, nodeR * 2);
        glow.addColorStop(0, this.theme.glow.replace(/[\d.]+\)$/, `${s.brightness * 0.2})`));
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(nx - nodeR * 2.5, ny - nodeR * 2.5, nodeR * 5, nodeR * 5);
      }

      ctx.beginPath();
      ctx.arc(nx, ny, nodeR, 0, Math.PI * 2);
      const alpha = 0.15 + s.brightness * 0.5;
      ctx.fillStyle = this.theme.primary.replace(/[\d.]+\)$/, `${alpha * 0.25})`);
      ctx.fill();
      ctx.strokeStyle = this.theme.primary.replace(/[\d.]+\)$/, `${alpha})`);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const breathe = Math.sin(this.time) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 5 + breathe * 2 + this.amplitude * 5, 0, Math.PI * 2);
    ctx.fillStyle = this.theme.primary.replace(/[\d.]+\)$/, `${0.15 + this.amplitude * 0.2})`);
    ctx.fill();
  }

  private updateAndDrawParticles(ctx: CanvasRenderingContext2D) {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.015;
      p.vx *= 0.99;
      p.life -= 1 / p.maxLife;

      if (p.life <= 0) return false;

      // Simple dot (no trail for perf)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;

      return true;
    });
  }

  private updateAndDrawRipples(ctx: CanvasRenderingContext2D) {
    this.ripples = this.ripples.filter((r) => {
      r.radius += (r.maxRadius - r.radius) * 0.05;
      r.life -= 0.018;

      if (r.life <= 0) return false;

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color.replace(/[\d.]+\)$/, `${r.life * 0.2})`);
      ctx.lineWidth = 1 * r.life;
      ctx.stroke();

      return true;
    });
  }

  private drawAnalyserBars(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const barCount = 48;
    const barW = w / barCount;
    const maxH = h * 0.2;
    const y0 = h;

    let freqData: Uint8Array | null = null;
    let micAmp = 0;

    try {
      const { audioEngine } = require("./audio-engine");
      freqData = audioEngine.getFrequencyData();
      if (audioEngine.isMicActive()) {
        micAmp = audioEngine.getMicAmplitude();
      }
    } catch {
      // audio engine not available
    }

    ctx.beginPath();
    ctx.moveTo(0, y0);

    for (let i = 0; i < barCount; i++) {
      let val = 0;
      if (freqData) {
        const bin = Math.floor((i / barCount) * (freqData.length * 0.4));
        val = freqData[bin] / 255;
      }

      const ambient = micAmp > 0.01
        ? micAmp * (0.25 + Math.sin(this.time * 4 + i) * 0.15)
        : Math.sin(this.time * 1.2 + i * 0.2) * 0.015 + 0.015;

      const combined = Math.max(val, ambient);
      const barH = combined * maxH * (1 + this.amplitude * 0.6);

      const x = i * barW;
      const y = y0 - barH;

      ctx.lineTo(x + barW / 2, y);
    }

    ctx.lineTo(w, y0);
    ctx.lineTo(0, y0);

    const grad = ctx.createLinearGradient(0, y0 - maxH, 0, y0);
    grad.addColorStop(0, this.theme.primary.replace(/[\d.]+\)$/, `${0.3 + this.amplitude * 0.3})`));
    grad.addColorStop(1, this.theme.primary.replace(/[\d.]+\)$/, `0.0)`));

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = this.theme.primary.replace(/[\d.]+\)$/, `${0.35 + this.amplitude * 0.4})`);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  destroy() {
    cancelAnimationFrame(this.animId);
  }
}
