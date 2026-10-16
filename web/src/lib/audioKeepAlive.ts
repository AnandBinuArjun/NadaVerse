/**
 * NadaVerse Audio Keep-Alive & Mobile Haptics Manager
 * 
 * 1. Screen Wake Lock API: Prevents screen sleep during long Carnatic practice sessions.
 * 2. iOS Safari Background Keep-Alive: Plays a silent audio loop to prevent iOS Safari 
 *    from suspending the Web Audio context when switching tabs or locking the screen.
 * 3. Vibration API: Gentle haptic feedback on Samam (beat 1) for tactile tala tracking.
 */

// 1-second silent WAV base64
const SILENT_WAV_BASE64 = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

class AudioKeepAliveManager {
  private wakeLockSentinel: any = null;
  private silentAudio: HTMLAudioElement | null = null;
  private activeKeepAliveCount = 0;
  private hapticsEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.activeKeepAliveCount > 0) {
          this.requestWakeLock();
        }
      });
    }
  }

  public enableKeepAlive(): void {
    this.activeKeepAliveCount++;
    this.requestWakeLock();
    this.startSilentAudio();
  }

  public disableKeepAlive(): void {
    this.activeKeepAliveCount = Math.max(0, this.activeKeepAliveCount - 1);
    if (this.activeKeepAliveCount === 0) {
      this.releaseWakeLock();
      this.stopSilentAudio();
    }
  }

  private async requestWakeLock(): Promise<void> {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (!this.wakeLockSentinel) {
          this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
          this.wakeLockSentinel.addEventListener('release', () => {
            this.wakeLockSentinel = null;
          });
        }
      } catch {
        // WakeLock request can fail if battery saver is on or document not active
      }
    }
  }

  private async releaseWakeLock(): Promise<void> {
    if (this.wakeLockSentinel) {
      try {
        await this.wakeLockSentinel.release();
      } catch {
        // ignore
      }
      this.wakeLockSentinel = null;
    }
  }

  private startSilentAudio(): void {
    if (typeof window === 'undefined') return;
    try {
      if (!this.silentAudio) {
        this.silentAudio = new Audio(SILENT_WAV_BASE64);
        this.silentAudio.loop = true;
        this.silentAudio.setAttribute('playsinline', 'true');
        this.silentAudio.setAttribute('aria-hidden', 'true');
        this.silentAudio.style.display = 'none';
      }
      this.silentAudio.play().catch(() => {
        // Autoplay may be restricted until first user interaction
      });
    } catch {
      // Audio element creation failover
    }
  }

  private stopSilentAudio(): void {
    if (this.silentAudio) {
      try {
        this.silentAudio.pause();
        this.silentAudio.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }

  /**
   * Haptic vibration on Samam (Beat 1) or accented kriyas
   */
  public triggerSamamHaptic(durationMs = 25): void {
    if (!this.hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // Vibration not permitted or not supported
      }
    }
  }

  public setHapticsEnabled(enabled: boolean): void {
    this.hapticsEnabled = enabled;
  }

  public getHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }
}

export const audioKeepAlive = new AudioKeepAliveManager();
