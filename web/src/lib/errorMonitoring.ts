import { API_BASE_URL } from './api';

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
    }

    // Always attempt client-to-backend error telemetry beacon
    if (typeof window !== 'undefined') {
      try {
        const payload = JSON.stringify({
          message: err.message,
          name: err.name,
          stack: err.stack ? err.stack.slice(0, 1000) : undefined,
          isAudioError,
          extra,
          timestamp: new Date().toISOString(),
        });
        const endpoint = `${API_BASE_URL}/api/v1/telemetry/errors`;
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
        } else {
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Drop reporting failures silently to prevent recursive crash
      }
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
export const errorMonitoring = errorMonitor;
