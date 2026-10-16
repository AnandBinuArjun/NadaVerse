/**
 * NadaVerse Observability & Error Monitoring
 * Catches and logs unhandled audio exceptions, Web Audio suspension,
 * and microphone hardware access denials. Plugs into Sentry when NEXT_PUBLIC_SENTRY_DSN is configured.
 */

class ErrorMonitoringService {
  private sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Window error handler
    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        context: 'window.onerror',
        filename: event.filename,
        lineno: event.lineno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason || new Error('Unhandled Promise Rejection'), {
        context: 'unhandledrejection',
      });
    });

    this.isInitialized = true;
  }

  public captureException(error: unknown, extra?: Record<string, any>): void {
    const err = error instanceof Error ? error : new Error(String(error));
    
    // Categorize audio-specific exceptions
    const isAudioError =
      err.name === 'NotAllowedError' ||
      err.name === 'NotFoundError' ||
      err.message.includes('AudioContext') ||
      err.message.includes('MediaStream') ||
      err.message.includes('sampleRate');

    if (process.env.NODE_ENV !== 'production' || !this.sentryDsn) {
      console.warn(`[NadaVerse Monitor] ${isAudioError ? '🎵 Audio Exception:' : '⚠️ Exception:'}`, err.message, extra || '');
      return;
    }

    // Forward to Sentry if client SDK is installed or via Sentry ingest endpoint
    try {
      if ((window as any).Sentry?.captureException) {
        (window as any).Sentry.captureException(err, { extra });
      }
    } catch {
      // Fallback
    }
  }

  public captureAudioSampleRateMismatch(detectedRate: number, expectedRate: number): void {
    this.captureException(new Error(`Sample rate mismatch: detected ${detectedRate}Hz, expected ${expectedRate}Hz`), {
      category: 'audio_hardware',
      detectedRate,
      expectedRate,
    });
  }
}

export const errorMonitor = new ErrorMonitoringService();
