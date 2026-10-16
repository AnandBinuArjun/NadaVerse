/**
 * Global Keyboard Shortcuts Manager for Hands-Free Carnatic Practice
 * 
 * Space: Play/Pause Tala metronome
 * T: Tap tempo
 * S: Toggle Tanpura drone
 * M: Toggle Mic Tuner
 */

type ShortcutAction = 'toggle_tala' | 'tap_tempo' | 'toggle_tanpura' | 'toggle_tuner';

class PracticeShortcutsManager {
  private listeners: Map<ShortcutAction, Set<() => void>> = new Map();

  constructor() {
    this.listeners.set('toggle_tala', new Set());
    this.listeners.set('tap_tempo', new Set());
    this.listeners.set('toggle_tanpura', new Set());
    this.listeners.set('toggle_tuner', new Set());

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    }
  }

  public subscribe(action: ShortcutAction, callback: () => void): () => void {
    const actionSet = this.listeners.get(action);
    if (actionSet) {
      actionSet.add(callback);
    }
    return () => {
      actionSet?.delete(callback);
    };
  }

  public trigger(action: ShortcutAction): void {
    const actionSet = this.listeners.get(action);
    if (actionSet) {
      actionSet.forEach((cb) => {
        try {
          cb();
        } catch (err) {
          console.error(`Error in shortcut handler for ${action}:`, err);
        }
      });
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Ignore if typing inside input, textarea, select or contenteditable
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable)
    ) {
      return;
    }

    // Ignore if modal dialog is open
    if (document.querySelector('[role="dialog"]')) {
      return;
    }

    // Space: Toggle Tala Metronome
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      this.trigger('toggle_tala');
      return;
    }

    // T: Tap Tempo
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      this.trigger('tap_tempo');
      return;
    }

    // S: Toggle Tanpura Drone
    if (e.key === 's' || e.key === 'S') {
      e.preventDefault();
      this.trigger('toggle_tanpura');
      return;
    }

    // M: Toggle Mic Tuner
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      this.trigger('toggle_tuner');
      return;
    }
  };
}

export const practiceShortcuts = new PracticeShortcutsManager();
