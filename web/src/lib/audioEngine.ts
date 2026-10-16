/**
 * NadaVerse High-Precision Web Audio API Engine
 * 
 * Provides:
 * 1. Tanpura / Shruti Companion overtone drone synthesis with Jivari harmonic simulation.
 * 2. Swara note auditioning using natural Just Intonation ratios.
 * 3. Drift-free Tala metronome scheduler utilizing Web Audio currentTime clock.
 */

export interface TonicNote {
  name: string;
  kattai: string; // Traditional Carnatic pitch name e.g. "1 Kattai", "1.5 Kattai"
  frequency: number; // Hz for octave 4 (Middle octave)
}

export const TONIC_OPTIONS: TonicNote[] = [
  { name: 'C', kattai: '1 Kattai', frequency: 261.63 },
  { name: 'C# / Db', kattai: '1.5 Kattai', frequency: 277.18 },
  { name: 'D', kattai: '2 Kattai', frequency: 293.66 },
  { name: 'D# / Eb', kattai: '2.5 Kattai', frequency: 311.13 },
  { name: 'E', kattai: '3 Kattai', frequency: 329.63 },
  { name: 'F', kattai: '4 Kattai', frequency: 349.23 },
  { name: 'F# / Gb', kattai: '4.5 Kattai', frequency: 369.99 },
  { name: 'G', kattai: '5 Kattai', frequency: 392.00 },
  { name: 'G# / Ab', kattai: '5.5 Kattai', frequency: 415.30 },
  { name: 'A', kattai: '6 Kattai', frequency: 440.00 },
  { name: 'A# / Bb', kattai: '6.5 Kattai', frequency: 466.16 },
  { name: 'B', kattai: '7 Kattai', frequency: 493.88 }
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Tanpura state
  private tanpuraGain: GainNode | null = null;
  private isTanpuraPlaying = false;
  private tanpuraOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentTonicFreq = 261.63; // C4

  // Tala Metronome state
  private isTalaPlaying = false;
  private talaBpm = 72;
  private totalBeats = 8;
  private currentBeat = 0;
  private talaTimerId: number | null = null;
  private nextBeatTime = 0.0;
  private readonly lookaheadMs = 25.0; // scheduling check frequency
  private readonly scheduleAheadSec = 0.1; // how far ahead to schedule
  private onBeatCallback: ((beatIndex: number, isAccent: boolean) => void) | null = null;
  private beatActionsList: { isAccent: boolean }[] = [];

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ---------------------------------------------------------------------------
  // 1. Shruti / Tanpura Synthesis
  // ---------------------------------------------------------------------------

  public startTanpura(tonicFreq = 261.63, volume = 0.7): void {
    const ctx = this.ensureContext();
    this.stopTanpura();

    this.currentTonicFreq = tonicFreq;
    this.tanpuraGain = ctx.createGain();
    this.tanpuraGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.tanpuraGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), ctx.currentTime + 1.2);
    this.tanpuraGain.connect(this.masterGain!);

    // A standard 4-string Carnatic tambura sounds:
    // String 1: Panchamam (Pa) = 3/2 * Sa / 2 (approx 1.5 * tonic * 0.5 = 0.75 tonic)
    // String 2: Madhya Sa (Middle Sa) = 1.0 * tonic
    // String 3: Madhya Sa = 1.0 * tonic (with subtle chorus detuning +0.8 Hz)
    // String 4: Mandra Sa (Low Sa) = 0.5 * tonic (one octave lower)

    const stringConfigs = [
      { freq: tonicFreq * 0.75, gain: 0.28, harmonics: [1, 2, 3, 4, 6] },
      { freq: tonicFreq, gain: 0.32, harmonics: [1, 2, 3, 4, 5] },
      { freq: tonicFreq * 1.002, gain: 0.32, harmonics: [1, 2, 3, 4, 5] }, // Jivari chorus beat
      { freq: tonicFreq * 0.5, gain: 0.40, harmonics: [1, 2, 3, 4, 5, 8] }
    ];

    this.tanpuraOscillators = [];

    stringConfigs.forEach((sc) => {
      sc.harmonics.forEach((h, hIdx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        // Overtone falloff emulating brass/bronze strings on wood with jivari buzz
        const falloff = 1 / Math.pow(h, 1.35);
        const oscGain = sc.gain * falloff * 0.35;

        osc.type = hIdx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(sc.freq * h, ctx.currentTime);

        g.gain.setValueAtTime(oscGain, ctx.currentTime);
        osc.connect(g);
        g.connect(this.tanpuraGain!);

        osc.start();
        this.tanpuraOscillators.push({ osc, gain: g });
      });
    });

    this.isTanpuraPlaying = true;
  }

  public stopTanpura(): void {
    if (!this.isTanpuraPlaying || !this.tanpuraGain || !this.ctx) return;

    const fadeTime = 0.5;
    this.tanpuraGain.gain.setValueAtTime(this.tanpuraGain.gain.value, this.ctx.currentTime);
    this.tanpuraGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + fadeTime);

    const oscsToStop = [...this.tanpuraOscillators];
    this.tanpuraOscillators = [];
    this.isTanpuraPlaying = false;

    setTimeout(() => {
      oscsToStop.forEach(({ osc }) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore if already stopped
        }
      });
    }, fadeTime * 1000 + 100);
  }

  public setTanpuraVolume(volume: number): void {
    if (this.tanpuraGain && this.ctx) {
      const v = Math.min(1.0, Math.max(0.001, volume));
      this.tanpuraGain.gain.setValueAtTime(this.tanpuraGain.gain.value, this.ctx.currentTime);
      this.tanpuraGain.gain.exponentialRampToValueAtTime(v, this.ctx.currentTime + 0.1);
    }
  }

  public getIsTanpuraPlaying(): boolean {
    return this.isTanpuraPlaying;
  }

  // ---------------------------------------------------------------------------
  // 2. Play Individual Swara Note (Just Intonation Auditioning)
  // ---------------------------------------------------------------------------

  public playSwaraNote(ratio: number, durationSeconds = 1.2): void {
    const ctx = this.ensureContext();
    const freq = this.currentTonicFreq * ratio;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm, bell-like decay emulating veena / flute note
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start();
    osc.stop(ctx.currentTime + durationSeconds);
  }

  // ---------------------------------------------------------------------------
  // 3. High-Precision Tala Metronome Scheduler
  // ---------------------------------------------------------------------------

  public startTala(
    bpm: number,
    totalAksharas: number,
    beatActions: { isAccent: boolean }[],
    onBeat: (beatIndex: number, isAccent: boolean) => void
  ): void {
    const ctx = this.ensureContext();
    this.stopTala();

    this.talaBpm = bpm;
    this.totalBeats = totalAksharas;
    this.beatActionsList = beatActions;
    this.onBeatCallback = onBeat;
    this.currentBeat = 0;
    this.isTalaPlaying = true;

    this.nextBeatTime = ctx.currentTime + 0.05;
    this.scheduler();
  }

  public stopTala(): void {
    this.isTalaPlaying = false;
    if (this.talaTimerId !== null) {
      window.clearTimeout(this.talaTimerId);
      this.talaTimerId = null;
    }
    this.currentBeat = 0;
  }

  public setTalaBpm(bpm: number): void {
    this.talaBpm = Math.max(30, Math.min(240, bpm));
  }

  public getIsTalaPlaying(): boolean {
    return this.isTalaPlaying;
  }

  private scheduler = (): void => {
    if (!this.isTalaPlaying || !this.ctx) return;

    while (this.nextBeatTime < this.ctx.currentTime + this.scheduleAheadSec) {
      this.scheduleBeat(this.currentBeat, this.nextBeatTime);
      this.advanceBeat();
    }

    this.talaTimerId = window.setTimeout(this.scheduler, this.lookaheadMs);
  };

  private advanceBeat(): void {
    const secondsPerBeat = 60.0 / this.talaBpm;
    this.nextBeatTime += secondsPerBeat;
    this.currentBeat = (this.currentBeat + 1) % this.totalBeats;
  }

  private scheduleBeat(beatIndex: number, time: number): void {
    if (!this.ctx) return;

    const isAccent = this.beatActionsList[beatIndex]?.isAccent ?? (beatIndex === 0);

    // Audio Click Synthesis:
    // Accent (Thattu/First beat): Richer, lower fundamental bell strike (800 Hz -> 200 Hz pitch drop)
    // Regular (Finger count/Wave): Crisper, higher frequency tick (1400 Hz -> 500 Hz drop)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isAccent ? 'triangle' : 'sine';

    if (isAccent) {
      osc.frequency.setValueAtTime(880, time);
      osc.frequency.exponentialRampToValueAtTime(220, time + 0.07);
      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    } else {
      osc.frequency.setValueAtTime(1320, time);
      osc.frequency.exponentialRampToValueAtTime(440, time + 0.04);
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    }

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.15);

    // Schedule UI callback aligned with the audio clock
    const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
    window.setTimeout(() => {
      if (this.isTalaPlaying && this.onBeatCallback) {
        this.onBeatCallback(beatIndex, isAccent);
      }
    }, delayMs);
  }
}

// Singleton audio engine instance for client use
export const audioEngine = new AudioEngine();
