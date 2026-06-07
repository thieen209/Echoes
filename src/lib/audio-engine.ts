import * as Tone from "tone";
import type { PlayableType } from "./instruments";

interface PlayOptions {
  frequency: number;
  timbre: PlayableType;
  velocity?: number;
  bendMultiplier?: number;
}

class EchoesAudioEngine {
  private isInitialized = false;
  private masterReverb: Tone.Reverb | null = null;
  private masterEQ: Tone.EQ3 | null = null;
  private masterVolume: Tone.Volume | null = null;
  private analyser: Tone.Analyser | null = null;
  private micAnalyser: Tone.Analyser | null = null;
  private micInput: Tone.UserMedia | null = null;

  // Samplers
  private samplers: Partial<Record<PlayableType, Tone.Sampler>> = {};
  
  // Advanced physically modeled synths as fallback while samples load or if samples are missing
  private fallbacks: Partial<Record<PlayableType, Tone.PolySynth | Tone.PluckSynth>> = {};

  async ensureContext(): Promise<boolean> {
    if (this.isInitialized) {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }
      return true;
    }

    await Tone.start();
    
    // Master Chain setup
    this.masterReverb = new Tone.Reverb({
      decay: 3.5,
      preDelay: 0.01,
      wet: 0.3
    });
    await this.masterReverb.generate();

    this.masterEQ = new Tone.EQ3({
      low: 1,
      mid: 0,
      high: 1
    });

    this.masterVolume = new Tone.Volume(-4);
    this.analyser = new Tone.Analyser("waveform", 256);

    Tone.Destination.chain(
      this.masterEQ,
      this.masterReverb,
      this.masterVolume,
      this.analyser
    );

    this.setupInstruments();
    this.setupVisibilityHandling();
    
    this.isInitialized = true;
    return true;
  }

  private setupVisibilityHandling() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && Tone.context.state !== "running") {
        Tone.start();
      }
    });
  }

  private setupInstruments() {
    // We set up Tone.Sampler for each instrument. 
    // In a real production scenario, you would point these URLs to sliced, normalized authentic .wav files
    // extracted from the /instruments folder.
    
    // Đàn Bầu
    this.samplers["single-string"] = new Tone.Sampler({
      urls: {
        C4: "/instruments/dan_bau_C4.wav",
      },
      release: 1,
      baseUrl: "",
    }).connect(Tone.Destination);

    // Đàn Tranh
    this.samplers["horizontal-strings"] = new Tone.Sampler({
      urls: {
        C4: "/instruments/dan_tranh_C4.wav",
      },
      release: 1.5,
      baseUrl: "",
    }).connect(Tone.Destination);

    // T'rưng
    this.samplers["bamboo-bars"] = new Tone.Sampler({
      urls: {
        C4: "/instruments/trung_C4.wav",
      },
      release: 0.8,
      baseUrl: "",
    }).connect(Tone.Destination);

    // Shamisen
    this.samplers["minimal-pluck"] = new Tone.Sampler({
      urls: {
        C4: "/instruments/shamisen_C4.wav",
      },
      release: 0.5,
      baseUrl: "",
    }).connect(Tone.Destination);

    // Sitar
    this.samplers["resonant-notes"] = new Tone.Sampler({
      urls: {
        C4: "/instruments/sitar_C4.wav",
      },
      release: 2,
      baseUrl: "",
    }).connect(Tone.Destination);

    // High-quality physical modeling fallbacks using Tone.js 
    // These ensure immediate, low-latency playback even if sample files are missing or loading
    this.fallbacks["single-string"] = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 2,
      modulationIndex: 1.5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 2 },
      modulation: { type: "triangle" },
      modulationEnvelope: { attack: 0.05, decay: 0.2, sustain: 0.2, release: 1.5 }
    }).connect(Tone.Destination);

    this.fallbacks["horizontal-strings"] = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.9
    }).connect(Tone.Destination);

    this.fallbacks["bamboo-bars"] = new Tone.PolySynth(Tone.MembraneSynth, {
      pitchDecay: 0.02,
      octaves: 1.5,
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.5 }
    }).connect(Tone.Destination);

    this.fallbacks["minimal-pluck"] = new Tone.PluckSynth({
      attackNoise: 2,
      dampening: 2000,
      resonance: 0.7
    }).connect(Tone.Destination);

    this.fallbacks["resonant-notes"] = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 0.5,
      modulationIndex: 5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0.4, release: 3 },
      modulation: { type: "sawtooth" },
      modulationEnvelope: { attack: 0.02, decay: 0.2, sustain: 0.1, release: 2 }
    }).connect(Tone.Destination);
  }

  getAmplitude(): number {
    if (!this.analyser) return 0;
    const values = this.analyser.getValue();
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += Math.abs(values[i] as number);
    }
    return sum / values.length;
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    // Switch analyser to fft mode temporarily isn't ideal;
    // instead we approximate from waveform data
    const values = this.analyser.getValue();
    const out = new Uint8Array(values.length);
    for (let i = 0; i < values.length; i++) {
      out[i] = Math.min(255, Math.round(Math.abs(values[i] as number) * 255));
    }
    return out;
  }

  isMicActive(): boolean {
    return this.micInput?.state === "started";
  }

  async enableMicrophone(): Promise<boolean> {
    await this.ensureContext();
    if (this.micInput?.state === "started") return true;

    try {
      this.micInput = new Tone.UserMedia();
      await this.micInput.open();
      this.micAnalyser = new Tone.Analyser("waveform", 256);
      this.micInput.connect(this.micAnalyser);
      return true;
    } catch {
      return false;
    }
  }

  getMicAmplitude(): number {
    if (!this.micAnalyser) return 0;
    const values = this.micAnalyser.getValue();
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += Math.abs(values[i] as number);
    }
    return sum / values.length;
  }

  async playNote(options: PlayOptions) {
    await this.ensureContext();
    const { frequency, timbre, velocity = 0.8, bendMultiplier = 1 } = options;
    const freq = frequency * bendMultiplier;
    const now = Tone.now();

    const sampler = this.samplers[timbre];
    const fallback = this.fallbacks[timbre];

    // Play using Sampler if loaded, otherwise fallback to physical modeling
    if (sampler && sampler.loaded) {
      sampler.triggerAttackRelease(freq, 2, now, velocity);
    } else if (fallback) {
      if (fallback instanceof Tone.PluckSynth) {
        // PluckSynth only accepts (note, time) — no duration or velocity
        fallback.triggerAttackRelease(freq, now);
      } else {
        fallback.triggerAttackRelease(freq, 1.5, now, velocity);
      }
    }
  }
}

export const audioEngine = new EchoesAudioEngine();
