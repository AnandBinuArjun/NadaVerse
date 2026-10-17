/**
 * NadaVerse Privacy-Friendly Analytics
 * Tracks practice usage (which ragas and kattais are most practiced) without
 * tracking personal identifiers or storing invasive cookies.
 * Compatible with Plausible, PostHog, or custom event logging.
 */

export interface PracticeAnalyticsEvent {
  action: 'practice_tanpura_start' | 'practice_tala_start' | 'tuner_start' | 'raga_view' | 'tutor_query';
  category: 'practice' | 'knowledge' | 'tutor';
  label?: string;
  kattai?: string;
  raga?: string;
  tala?: string;
  bpm?: number;
}

class AnalyticsService {
  private enabled = true;

  public track(event: PracticeAnalyticsEvent): void {
    if (!this.enabled || typeof window === 'undefined') return;

    // 1. Plausible Analytics integration (if script is embedded)
    if (typeof (window as any).plausible === 'function') {
      try {
        (window as any).plausible(event.action, {
          props: {
            category: event.category,
            label: event.label,
            kattai: event.kattai,
            raga: event.raga,
            tala: event.tala,
            bpm: event.bpm,
          },
        });
      } catch {
        // silent failover
      }
    }

    // 2. PostHog integration (if script is present)
    if ((window as any).posthog?.capture) {
      try {
        (window as any).posthog.capture(event.action, event);
      } catch {
        // silent failover
      }
    }

    // Local anonymous counters in localStorage to display popular kattais/ragas to user
    try {
      if (event.kattai) {
        const counts = JSON.parse(localStorage.getItem('nadaverse_kattai_counts') || '{}');
        counts[event.kattai] = (counts[event.kattai] || 0) + 1;
        localStorage.setItem('nadaverse_kattai_counts', JSON.stringify(counts));
      }
      if (event.raga) {
        const counts = JSON.parse(localStorage.getItem('nadaverse_raga_counts') || '{}');
        counts[event.raga] = (counts[event.raga] || 0) + 1;
        localStorage.setItem('nadaverse_raga_counts', JSON.stringify(counts));
      }
    } catch {
      // ignore storage limitations
    }
  }

  public trackTanpuraStart(kattai: string, noteName: string): void {
    this.track({
      action: 'practice_tanpura_start',
      category: 'practice',
      label: `${noteName} (${kattai})`,
      kattai,
    });
  }

  public trackTalaStart(talaName: string, bpm: number): void {
    this.track({
      action: 'practice_tala_start',
      category: 'practice',
      label: `${talaName} @ ${bpm} BPM`,
      tala: talaName,
      bpm,
    });
  }

  public trackRagaView(ragaName: string, melakartaNumber?: number): void {
    this.track({
      action: 'raga_view',
      category: 'knowledge',
      label: melakartaNumber ? `${ragaName} (#${melakartaNumber})` : ragaName,
      raga: ragaName,
    });
  }

  public trackTutorQuery(topic: string): void {
    this.track({
      action: 'tutor_query',
      category: 'tutor',
      label: topic.slice(0, 50),
    });
  }
}

export const analytics = new AnalyticsService();
