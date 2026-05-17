import type { PlayableType } from "./instruments";

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

interface PlayOptions {
  frequency: number;
  timbre: PlayableType;
  velocity?: number;
  bendMultiplier?: number;
}

const INSTRUMENT_COLORS: Record<PlayableType, { wet: number; dry: number }> = {
  "single-string": { wet: 0.45, dry: 0.55 },
  "horizontal-strings": { wet: 0.35, dry: 0.65 },
  "bamboo-bars": { wet: 0.2, dry: 0.8 },
  "minimal-pluck": { wet: 0.25, dry: 0.75 },
  "resonant-notes": { wet: 0.5, dry: 0.5 },
};

class EchoesAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private analyser: AnalyserNode | null = null;
  private analyserData: Uint8Array | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micData: Uint8Array | null = null;
  private micStream: MediaStream | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;

  ensureContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    }
    const w = window as AudioWindow;
    const Ctor = w.AudioContext ?? w.webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.buildMasterChain();
    this.setupVisibilityHandling();
    return this.ctx;
  }

  private setupVisibilityHandling() {
    const resume = () => {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") resume();
    });
    window.addEventListener("focus", resume);
  }

  private buildMasterChain() {
    const ctx = this.ctx!;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.65;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;
    this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

    this.convolver = ctx.createConvolver();
    this.convolver.buffer = this.makeImpulse(2.8, 2.6);

    this.dryGain = ctx.createGain();
    this.dryGain.gain.value = 0.6;
    this.wetGain = ctx.createGain();
    this.wetGain.gain.value = 0.4;

    this.masterGain.connect(this.dryGain);
    this.masterGain.connect(this.convolver);
    this.convolver.connect(this.wetGain);
    this.dryGain.connect(this.analyser);
    this.wetGain.connect(this.analyser);
    this.analyser.connect(ctx.destination);
  }

  private makeImpulse(duration: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * duration;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  setReverbMix(timbre: PlayableType) {
    const mix = INSTRUMENT_COLORS[timbre];
    if (this.dryGain && this.wetGain) {
      this.dryGain.gain.value = mix.dry;
      this.wetGain.gain.value = mix.wet;
    }
  }

  getAmplitude(): number {
    if (!this.analyser || !this.analyserData) return 0;
    this.analyser.getByteFrequencyData(
      this.analyserData as Uint8Array<ArrayBuffer>,
    );
    let sum = 0;
    for (let i = 0; i < this.analyserData.length; i++) sum += this.analyserData[i];
    return sum / (this.analyserData.length * 255);
  }

  isMicActive(): boolean {
    return Boolean(this.micStream);
  }

  async enableMicrophone(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx || this.micStream) return Boolean(this.micStream);
    if (!navigator.mediaDevices?.getUserMedia) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const source = ctx.createMediaStreamSource(stream);
      this.micAnalyser = ctx.createAnalyser();
      this.micAnalyser.fftSize = 256;
      this.micAnalyser.smoothingTimeConstant = 0.9;
      this.micData = new Uint8Array(this.micAnalyser.frequencyBinCount);
      source.connect(this.micAnalyser);
      this.micStream = stream;
      return true;
    } catch {
      return false;
    }
  }

  getMicAmplitude(): number {
    if (!this.micAnalyser || !this.micData) return 0;
    this.micAnalyser.getByteFrequencyData(
      this.micData as Uint8Array<ArrayBuffer>,
    );
    let sum = 0;
    for (let i = 0; i < this.micData.length; i++) sum += this.micData[i];
    return sum / (this.micData.length * 255);
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.analyserData) return null;
    this.analyser.getByteFrequencyData(
      this.analyserData as Uint8Array<ArrayBuffer>,
    );
    return this.analyserData;
  }

  playNote(options: PlayOptions) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    this.setReverbMix(options.timbre);
    const { frequency, timbre, velocity = 0.8, bendMultiplier = 1 } = options;
    const freq = frequency * bendMultiplier;
    const now = ctx.currentTime;

    switch (timbre) {
      case "single-string": this.danBau(ctx, freq, velocity, now); break;
      case "horizontal-strings": this.danTranh(ctx, freq, velocity, now); break;
      case "bamboo-bars": this.trung(ctx, freq, velocity, now); break;
      case "minimal-pluck": this.shamisen(ctx, freq, velocity, now); break;
      case "resonant-notes": this.sitar(ctx, freq, velocity, now); break;
    }
  }

  private connect(node: AudioNode) {
    node.connect(this.masterGain!);
  }

  private osc(ctx: AudioContext, type: OscillatorType, freq: number, now: number, dur: number): OscillatorNode {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    o.start(now);
    o.stop(now + dur + 0.1);
    return o;
  }

  private env(ctx: AudioContext, now: number, attack: number, peak: number, decay: number, sustain: number, release: number, dur: number): GainNode {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(Math.max(sustain, 0.001), now + attack + decay);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    return g;
  }

  /* ── Đàn Bầu ── */
  private danBau(ctx: AudioContext, freq: number, vel: number, now: number) {
    const dur = 3.8;
    const main = this.osc(ctx, "sine", freq, now, dur);
    main.frequency.exponentialRampToValueAtTime(freq * 0.997, now + dur);
    const mainG = this.env(ctx, now, 0.012, 0.38 * vel, 0.4, 0.18 * vel, dur, dur);

    const sub = this.osc(ctx, "sine", freq * 0.5, now, dur * 0.8);
    const subG = this.env(ctx, now, 0.02, 0.1 * vel, 0.3, 0.04 * vel, dur * 0.7, dur * 0.8);

    const ot = this.osc(ctx, "sine", freq * 2.005, now, dur * 0.6);
    const otG = this.env(ctx, now, 0.03, 0.07 * vel, 0.2, 0.02 * vel, dur * 0.5, dur * 0.6);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + dur * 0.8);
    filter.Q.value = 1.8;

    main.connect(mainG); sub.connect(subG); ot.connect(otG);
    mainG.connect(filter); subG.connect(filter); otG.connect(filter);
    this.connect(filter);
  }

  /* ── Đàn Tranh ── */
  private danTranh(ctx: AudioContext, freq: number, vel: number, now: number) {
    const dur = 2.2;
    const main = this.osc(ctx, "sine", freq, now, dur);
    const mainG = this.env(ctx, now, 0.008, 0.34 * vel, 0.15, 0.12 * vel, dur * 0.8, dur);

    const bright = this.osc(ctx, "triangle", freq * 1.002, now, dur * 0.7);
    const brightG = this.env(ctx, now, 0.005, 0.14 * vel, 0.1, 0.03 * vel, dur * 0.5, dur * 0.7);

    const ot = this.osc(ctx, "sine", freq * 3.01, now, dur * 0.4);
    const otG = this.env(ctx, now, 0.004, 0.04 * vel, 0.08, 0.001, dur * 0.3, dur * 0.4);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(4200, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + dur * 0.6);

    main.connect(mainG); bright.connect(brightG); ot.connect(otG);
    mainG.connect(filter); brightG.connect(filter); otG.connect(filter);
    this.connect(filter);
  }

  /* ── T'rưng ── */
  private trung(ctx: AudioContext, freq: number, vel: number, now: number) {
    const dur = 1.1;
    const main = this.osc(ctx, "triangle", freq, now, dur);
    const mainG = this.env(ctx, now, 0.003, 0.42 * vel, 0.06, 0.08 * vel, dur * 0.7, dur);

    const body = this.osc(ctx, "sine", freq * 0.998, now, dur * 0.5);
    const bodyG = this.env(ctx, now, 0.002, 0.18 * vel, 0.04, 0.001, dur * 0.3, dur * 0.5);

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(freq * 1.5, now);
    bp.Q.value = 3;

    main.connect(mainG); body.connect(bodyG);
    mainG.connect(bp); bodyG.connect(bp);
    this.connect(bp);
  }

  /* ── Shamisen ── */
  private shamisen(ctx: AudioContext, freq: number, vel: number, now: number) {
    const dur = 1.6;
    const main = this.osc(ctx, "sawtooth", freq, now, dur);
    const mainG = this.env(ctx, now, 0.002, 0.3 * vel, 0.04, 0.1 * vel, dur * 0.6, dur);

    const body = this.osc(ctx, "square", freq * 0.5, now, dur * 0.3);
    const bodyG = this.env(ctx, now, 0.001, 0.06 * vel, 0.02, 0.001, dur * 0.15, dur * 0.3);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1800, now);
    lp.frequency.exponentialRampToValueAtTime(500, now + dur * 0.5);
    lp.Q.value = 4;

    main.connect(mainG); body.connect(bodyG);
    mainG.connect(lp); bodyG.connect(lp);
    this.connect(lp);
  }

  /* ── Sitar ── */
  private sitar(ctx: AudioContext, freq: number, vel: number, now: number) {
    const dur = 4.2;
    const main = this.osc(ctx, "sine", freq, now, dur);
    const mainG = this.env(ctx, now, 0.01, 0.32 * vel, 0.5, 0.15 * vel, dur * 0.8, dur);

    const buzz = this.osc(ctx, "sawtooth", freq * 1.003, now, dur * 0.7);
    const buzzG = this.env(ctx, now, 0.015, 0.06 * vel, 0.3, 0.02 * vel, dur * 0.5, dur * 0.7);

    // Sympathetic strings
    const sympathetic = [2, 3, 4, 1.5];
    for (const mult of sympathetic) {
      const s = this.osc(ctx, "sine", freq * mult, now + 0.05, dur * 0.5);
      const sG = this.env(ctx, now + 0.05, 0.08, 0.025 * vel, 0.2, 0.008 * vel, dur * 0.4, dur * 0.5);
      s.connect(sG);
      this.connect(sG);
    }

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(3200, now);
    lp.frequency.exponentialRampToValueAtTime(900, now + dur * 0.7);
    lp.Q.value = 1.2;

    main.connect(mainG); buzz.connect(buzzG);
    mainG.connect(lp); buzzG.connect(lp);
    this.connect(lp);
  }
}

export const audioEngine = new EchoesAudioEngine();
