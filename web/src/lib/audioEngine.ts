/**
 * NadaVerse High-Precision Web Audio API Engine
 * 
 * Provides:
 * 1. Tanpura overtone drone synthesis supporting Pa, Ma, and Ni Shruti tunings with Jivari resonance.
 * 2. Swara note and Raga scale auditioning using pure Just Intonation ratios.
 * 3. Drift-free Tala metronome scheduler with acoustic bell and Mridangam Solkattu stroke synthesis.
 */

import { audioKeepAlive } from './audioKeepAlive';

export type ShrutiTuning = 'pa' | 'ma' | 'ni';

export type NoteName =
  | 'C'
  | 'C#'
  | 'C# / Db'
  | 'D'
  | 'D#'
  | 'D# / Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'F# / Gb'
  | 'G'
  | 'G#'
  | 'G# / Ab'
  | 'A'
  | 'A#'
  | 'A# / Bb'
  | 'B'
  | string;

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
  private isUnlocked = false;

  // Tanpura state
  private tanpuraGain: GainNode | null = null;
  private isTanpuraPlaying = false;
  private tanpuraOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentTonicFreq = 261.63; // C4
  private currentTonicName = 'C';
  private currentVolume = 0.7;
  private currentShrutiTuning: ShrutiTuning = 'pa';

  // Raga scale playback state
  private scaleTimeouts: number[] = [];
  private isScalePlaying = false;

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
  private beatActionsList: { isAccent: boolean; syllable?: string }[] = [];
  private solkattuMode = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. One-time gesture listener to unlock Web Audio hardware on first touch/click
      const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown'];
      const onUserInteraction = () => {
        this.unlockAudio();
        unlockEvents.forEach((ev) => window.removeEventListener(ev, onUserInteraction, true));
      };
      unlockEvents.forEach((ev) => window.addEventListener(ev, onUserInteraction, { capture: true, passive: true }));

      // 2. Foreground & BFCache restoration (prevents audio freeze when switching apps or locking screen)
      const onForegroundResume = async () => {
        if (document.visibilityState === 'visible') {
          await this.recoverAudioContext();
        }
      };

      document.addEventListener('visibilitychange', onForegroundResume);
      window.addEventListener('pageshow', onForegroundResume);
      window.addEventListener('focus', onForegroundResume);
    }
  }

  /**
   * Unlocks the mobile audio hardware bus using a 1-sample silent buffer on first user touch.
   * Crucial for iOS Safari and Chrome Android autoplay policies.
   */
  public async unlockAudio(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const ctx = this.ensureContext();
      const state = ctx.state as string;
      if (state === 'suspended' || state === 'interrupted') {
        await ctx.resume();
      }
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      this.isUnlocked = true;
      return true;
    } catch (err) {
      console.debug('Web Audio hardware unlock deferred:', err);
      return false;
    }
  }

  /**
   * Recovers AudioContext if the mobile browser suspended or interrupted it during backgrounding.
   */
  public async recoverAudioContext(): Promise<void> {
    if (!this.ctx) return;
    const state = this.ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      try {
        await this.ctx.resume();
      } catch {
        this.recreateContext();
      }
    } else if (state === 'closed') {
      this.recreateContext();
    }

    // Re-engage Tanpura if it was actively playing before tab suspension
    if (this.isTanpuraPlaying) {
      this.restartTanpura();
    }
  }

  /**
   * Recreates the AudioContext if closed or unrecoverable.
   */
  public recreateContext(): AudioContext {
    if (this.ctx) {
      try {
        this.ctx.close().catch(() => {});
      } catch {}
      this.ctx = null;
      this.masterGain = null;
    }
    return this.ensureContext();
  }

  private ensureContext(): AudioContext {
    if (typeof window === 'undefined') {
      throw new Error('AudioContext unavailable in server environment');
    }
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Listen for browser interruptions (phone calls, iOS backgrounding)
      this.ctx.onstatechange = () => {
        const s = this.ctx ? (this.ctx.state as string) : 'closed';
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('nadaverse:audiocontext_state', { detail: { state: s } }));
        }
      };
    }

    const state = this.ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // ---------------------------------------------------------------------------
  // 1. Shruti / Tanpura Synthesis (Pa, Ma, Ni Shruti Modes)
  // ---------------------------------------------------------------------------

  public async startTanpura(tonicFreq = 261.63, volume = 0.7, tuning: ShrutiTuning = 'pa'): Promise<void> {
    const ctx = this.ensureContext();
    this.stopTanpura();

    this.currentTonicFreq = tonicFreq;
    this.currentVolume = volume;
    this.currentShrutiTuning = tuning;

    const state = ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      try {
        await ctx.resume();
      } catch (err) {
        console.debug('startTanpura resume error:', err);
      }
    }

    const now = ctx.currentTime;
    this.tanpuraGain = ctx.createGain();
    this.tanpuraGain.gain.setValueAtTime(0.001, now);
    this.tanpuraGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), now + 1.2);
    this.tanpuraGain.connect(this.masterGain!);

    // String 1 depends on Shruti tuning:
    // Pa Shruti: Panchama (3/2 * Sa / 2 = 0.75 * tonic) - used for most ragas
    // Ma Shruti: Shuddha Madhyama (4/3 * Sa / 2 = 0.6667 * tonic) - used for Hindolam, Madhyamavati, Kamas
    // Ni Shruti: Kakali Nishada (15/8 * Sa / 2 = 0.9375 * tonic) - used for Marwa, Bhoopalam, Varali
    let firstStringRatio = 0.75;
    if (tuning === 'ma') {
      firstStringRatio = 2.0 / 3.0; // 4/3 / 2
    } else if (tuning === 'ni') {
      firstStringRatio = 15.0 / 16.0; // 15/8 / 2
    }

    const stringConfigs = [
      { freq: tonicFreq * firstStringRatio, gain: 0.30, harmonics: [1, 2, 3, 4, 6] },
      { freq: tonicFreq, gain: 0.32, harmonics: [1, 2, 3, 4, 5] },
      { freq: tonicFreq * 1.002, gain: 0.32, harmonics: [1, 2, 3, 4, 5] }, // Jivari chorus beat
      { freq: tonicFreq * 0.5, gain: 0.40, harmonics: [1, 2, 3, 4, 5, 8] }  // Kharaja Sa
    ];

    this.tanpuraOscillators = [];

    stringConfigs.forEach((sc) => {
      sc.harmonics.forEach((h, hIdx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        // Overtone falloff emulating bronze strings on jackwood soundbox with jivari silk threads
        const falloff = 1 / Math.pow(h, 1.35);
        const oscGain = sc.gain * falloff * 0.35;

        osc.type = hIdx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(sc.freq * h, now);

        g.gain.setValueAtTime(oscGain, now);
        osc.connect(g);
        g.connect(this.tanpuraGain!);

        osc.start(now);
        this.tanpuraOscillators.push({ osc, gain: g });
      });
    });

    this.isTanpuraPlaying = true;
    audioKeepAlive.enableKeepAlive();
  }

  private restartTanpura(): void {
    if (!this.isTanpuraPlaying) return;
    this.tanpuraOscillators.forEach(({ osc }) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.tanpuraOscillators = [];
    this.startTanpura(this.currentTonicFreq, this.currentVolume, this.currentShrutiTuning);
  }

  public setShrutiTuning(tuning: ShrutiTuning): void {
    if (this.currentShrutiTuning === tuning) return;
    this.currentShrutiTuning = tuning;
    if (this.isTanpuraPlaying) {
      this.startTanpura(this.currentTonicFreq, this.currentVolume, tuning);
    }
  }

  public getShrutiTuning(): ShrutiTuning {
    return this.currentShrutiTuning;
  }

  public setTonic(tonic: string | number): void {
    if (typeof tonic === 'number') {
      this.currentTonicFreq = tonic;
      const match = TONIC_OPTIONS.find((t) => Math.abs(t.frequency - tonic) < 1.0);
      this.currentTonicName = match ? match.name : `${tonic.toFixed(1)} Hz`;
    } else {
      const clean = tonic.trim().toLowerCase();
      const match = TONIC_OPTIONS.find(
        (t) =>
          t.name.toLowerCase() === clean ||
          t.name.toLowerCase().startsWith(clean) ||
          t.kattai.toLowerCase() === clean ||
          t.kattai.toLowerCase().startsWith(clean)
      );
      if (match) {
        this.currentTonicFreq = match.frequency;
        this.currentTonicName = match.name;
      }
    }

    if (this.isTanpuraPlaying) {
      this.startTanpura(this.currentTonicFreq, this.currentVolume, this.currentShrutiTuning);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('nadaverse:tonic_changed', {
          detail: { frequency: this.currentTonicFreq, name: this.currentTonicName }
        })
      );
    }
  }

  public getTonic(): { name: string; frequency: number } {
    return { name: this.currentTonicName, frequency: this.currentTonicFreq };
  }

  public stopTanpura(): void {
    if (!this.isTanpuraPlaying || !this.tanpuraGain || !this.ctx) return;

    audioKeepAlive.disableKeepAlive();
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
          // ignore
        }
      });
    }, fadeTime * 1000 + 100);
  }

  public setTanpuraVolume(volume: number): void {
    this.currentVolume = volume;
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
  // 2. Play Individual Swara Note & Raga Scale Sequencer
  // ---------------------------------------------------------------------------

  public playSwaraNote(ratio: number, durationSeconds = 1.0): void {
    const ctx = this.ensureContext();
    const freq = this.currentTonicFreq * ratio;

    const doPlay = () => {
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Warm, bell-like decay emulating veena / flute note
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.45, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + durationSeconds);
      } catch (err) {
        console.debug('Error in playSwaraNote, recreating context:', err);
        this.recreateContext();
      }
    };

    const state = ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      ctx.resume().then(doPlay).catch(doPlay);
    } else {
      doPlay();
    }
  }

  public playRagaScale(
    ratios: number[],
    stepIntervalMs = 500,
    onStep?: (index: number) => void,
    onComplete?: () => void
  ): void {
    this.stopRagaScale();
    this.isScalePlaying = true;

    ratios.forEach((ratio, idx) => {
      const tid = window.setTimeout(() => {
        if (!this.isScalePlaying) return;
        this.playSwaraNote(ratio, (stepIntervalMs / 1000) * 1.2);
        if (onStep) onStep(idx);

        if (idx === ratios.length - 1) {
          window.setTimeout(() => {
            this.isScalePlaying = false;
            if (onComplete) onComplete();
          }, stepIntervalMs);
        }
      }, idx * stepIntervalMs);

      this.scaleTimeouts.push(tid);
    });
  }

  public stopRagaScale(): void {
    this.isScalePlaying = false;
    this.scaleTimeouts.forEach((tid) => clearTimeout(tid));
    this.scaleTimeouts = [];
  }

  public getIsScalePlaying(): boolean {
    return this.isScalePlaying;
  }

  // ---------------------------------------------------------------------------
  // 3. High-Precision Tala Metronome & Mridangam Solkattu Scheduler
  // ---------------------------------------------------------------------------

  public async startTala(
    bpm: number,
    totalAksharas: number,
    beatActions: { isAccent: boolean; syllable?: string }[],
    onBeat: (beatIndex: number, isAccent: boolean) => void
  ): Promise<void> {
    const ctx = this.ensureContext();
    this.stopTala();

    const state = ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      try {
        await ctx.resume();
      } catch (err) {
        console.debug('startTala resume error:', err);
      }
    }

    this.talaBpm = bpm;
    this.totalBeats = totalAksharas;
    this.beatActionsList = beatActions;
    this.onBeatCallback = onBeat;
    this.currentBeat = 0;
    this.isTalaPlaying = true;
    audioKeepAlive.enableKeepAlive();

    this.nextBeatTime = ctx.currentTime + 0.05;
    this.scheduler();
  }

  public stopTala(): void {
    if (this.isTalaPlaying) {
      audioKeepAlive.disableKeepAlive();
    }
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

  public setSolkattuMode(enabled: boolean): void {
    this.solkattuMode = enabled;
  }

  public getSolkattuMode(): boolean {
    return this.solkattuMode;
  }

  private nadai: 'chatusra' | 'tisra' = 'chatusra';
  private nadaiLoopsEnabled = false;

  public setNadai(nadai: 'chatusra' | 'tisra'): void {
    this.nadai = nadai;
  }

  public getNadai(): 'chatusra' | 'tisra' {
    return this.nadai;
  }

  public setNadaiLoopsEnabled(enabled: boolean): void {
    this.nadaiLoopsEnabled = enabled;
  }

  public getNadaiLoopsEnabled(): boolean {
    return this.nadaiLoopsEnabled;
  }

  private scheduler = (): void => {
    if (!this.isTalaPlaying || !this.ctx) return;

    // Prevent scheduling loop spike when returning to foreground
    if (this.nextBeatTime < this.ctx.currentTime) {
      this.nextBeatTime = this.ctx.currentTime + 0.02;
    }

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

    const action = this.beatActionsList[beatIndex];
    const isAccent = action?.isAccent ?? (beatIndex === 0);
    const syllable = action?.syllable?.toLowerCase() || '';

    if (this.solkattuMode) {
      // Primary Mridangam Solkattu Stroke Synthesis on the beat
      this.synthesizeMridangamStroke(time, syllable, isAccent, 1.0);

      // Accompaniment Nadai Loops (Chatusra / Tisra sub-divisions)
      if (this.nadaiLoopsEnabled) {
        const secondsPerBeat = 60.0 / this.talaBpm;
        if (this.nadai === 'chatusra') {
          // Tha (beat) -> Ka (1/4) -> Dhi (2/4) -> Mi (3/4)
          const sub = secondsPerBeat / 4;
          this.synthesizeMridangamStroke(time + sub * 1, 'ka', false, 0.45);
          this.synthesizeMridangamStroke(time + sub * 2, 'dhi', false, 0.55);
          this.synthesizeMridangamStroke(time + sub * 3, 'mi', false, 0.50);
        } else if (this.nadai === 'tisra') {
          // Tha (beat) -> Ki (1/3) -> Ta (2/3)
          const sub = secondsPerBeat / 3;
          this.synthesizeMridangamStroke(time + sub * 1, 'ki', false, 0.45);
          this.synthesizeMridangamStroke(time + sub * 2, 'ta', false, 0.55);
        }
      }
    } else {
      // Precision Bell / Woodblock Metronome
      this.synthesizeBellStroke(time, isAccent);
    }

    // Schedule UI callback & haptic pulse on Samam (beat 1) aligned with audio clock
    const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
    window.setTimeout(() => {
      if (this.isTalaPlaying) {
        if (beatIndex === 0) {
          audioKeepAlive.triggerSamamHaptic(25);
        }
        if (this.onBeatCallback) {
          this.onBeatCallback(beatIndex, isAccent);
        }
      }
    }, delayMs);
  }

  private synthesizeBellStroke(time: number, isAccent: boolean): void {
    if (!this.ctx) return;
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
  }

  private synthesizeMridangamStroke(
    time: number,
    syllable: string,
    isAccent: boolean,
    gainFactor = 1.0
  ): void {
    if (!this.ctx) return;

    // Thom (Thoppi bass stroke): deep resonant boom ~115 Hz -> 70 Hz
    if (syllable.includes('thom') || (isAccent && !syllable)) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(115, time);
      osc.frequency.exponentialRampToValueAtTime(70, time + 0.20);
      gain.gain.setValueAtTime(0.85 * gainFactor, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + 0.26);
      return;
    }

    // Tha / Nam / Chaapu (Valanthalai metallic overtone tuned to tonic pitch)
    if (syllable.includes('tha') || syllable.includes('nam') || syllable.includes('chaapu')) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.currentTonicFreq, time);
      gain.gain.setValueAtTime(0.60 * gainFactor, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + 0.17);
      return;
    }

    // Ka / Ki (Muted base slap)
    if (syllable.includes('ka') || syllable.includes('ki')) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(90, time + 0.04);
      gain.gain.setValueAtTime(0.40 * gainFactor, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + 0.06);
      return;
    }

    // Dhi / Ta / Mi (Crisp middle rim / slap stroke)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, time);
    osc.frequency.exponentialRampToValueAtTime(170, time + 0.04);
    gain.gain.setValueAtTime(0.48 * gainFactor, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.07);
  }

  /**
   * Play a clean, resonant Carnatic swara tone using Just Intonation frequency
   */
  auditionNote(frequency: number, durationSec = 0.45): void {
    if (typeof window === 'undefined' || frequency <= 0) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(frequency * 2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + Math.max(0.1, durationSec));

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + durationSec + 0.05);
    oscHarmonic.stop(now + durationSec + 0.05);
  }

  /**
   * Audition authentic acoustic timbre for Carnatic instruments using Web Audio API synthesis
   */
  auditionInstrument(slug: string): void {
    if (typeof window === 'undefined') return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    if (slug === 'saraswati-veena') {
      // 4 Main playing strings: Anumandaram (C3), Mandaram (G3), Madhya Sa (C4), Madhya Pa (G4)
      const freqs = [130.81, 196.0, 261.63, 392.0];
      freqs.forEach((f, idx) => {
        const time = now + idx * 0.28;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, time);
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.4, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(time);
        osc.stop(time + 0.65);
      });
      return;
    }

    if (slug === 'carnatic-violin') {
      // Bowed string pairs: Mandra Pa (196 Hz), Madhya Sa (261.63 Hz), Madhya Pa (392 Hz), Tara Sa (523.25 Hz)
      const freqs = [196.0, 261.63, 392.0, 523.25];
      freqs.forEach((f, idx) => {
        const time = now + idx * 0.32;
        const osc = ctx.createOscillator();
        const oscHarm = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        oscHarm.type = 'sine';
        osc.frequency.setValueAtTime(f, time);
        oscHarm.frequency.setValueAtTime(f * 2, time);
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.25, time + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
        osc.connect(gain);
        oscHarm.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(time);
        oscHarm.start(time);
        osc.stop(time + 0.5);
        oscHarm.stop(time + 0.5);
      });
      return;
    }

    if (slug === 'mridangam') {
      // Rhythmic solkattu pattern: Thom -> Tha -> Dhi -> Mi -> Thom
      this.synthesizeMridangamStroke(now, 'thom', true, 1.2);
      this.synthesizeMridangamStroke(now + 0.3, 'tha', false, 0.9);
      this.synthesizeMridangamStroke(now + 0.6, 'dhi', false, 0.9);
      this.synthesizeMridangamStroke(now + 0.9, 'mi', false, 0.9);
      this.synthesizeMridangamStroke(now + 1.2, 'thom', true, 1.3);
      return;
    }

    if (slug === 'ghatam') {
      // High ceramic neck slap + deep belly air resonance
      const time1 = now;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(680, time1);
      osc1.frequency.exponentialRampToValueAtTime(450, time1 + 0.05);
      gain1.gain.setValueAtTime(0.5, time1);
      gain1.gain.exponentialRampToValueAtTime(0.001, time1 + 0.09);
      osc1.connect(gain1);
      gain1.connect(this.masterGain!);
      osc1.start(time1);
      osc1.stop(time1 + 0.1);

      const time2 = now + 0.35;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, time2);
      gain2.gain.setValueAtTime(0.65, time2);
      gain2.gain.exponentialRampToValueAtTime(0.001, time2 + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.masterGain!);
      osc2.start(time2);
      osc2.stop(time2 + 0.25);
      return;
    }

    if (slug === 'kanjira') {
      // Deep pitch-bending gumki slap (90 Hz -> 150 Hz -> 80 Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.38);
      return;
    }

    if (slug === 'tambura') {
      // Cascade drone string arpeggio (Pa, Sa, Sa, Sa)
      const freqs = [196.0, 261.63, 262.1, 130.81];
      freqs.forEach((f, idx) => {
        const time = now + idx * 0.4;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.35, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(time);
        osc.stop(time + 1.0);
      });
      return;
    }

    if (slug === 'carnatic-flute') {
      // Warm bamboo flute ascending Mohanam melody: S - R2 - G3 - P (261.63, 294.33, 327.03, 392.44 Hz)
      const notes = [261.63, 294.33, 327.03, 392.44];
      notes.forEach((f, idx) => {
        const time = now + idx * 0.35;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.32, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(time);
        osc.stop(time + 0.45);
      });
      return;
    }

    // Default fallback single clean note
    this.auditionNote(261.63, 0.6);
  }
}

// Singleton audio engine instance for client use
export const audioEngine = new AudioEngine();
