'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorMonitoring } from '../lib/errorMonitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    errorMonitoring.captureException(error, {
      componentStack: errorInfo.componentStack,
      context: 'ReactErrorBoundary',
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#11110F] text-[#F4EBDD] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1A1916] border border-[#C7A45B]/30 rounded-3xl p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C7A45B]/10 border border-[#C7A45B]/30 flex items-center justify-center text-[#C7A45B] text-2xl font-serif">
              ॐ
            </div>
            <h2 className="text-xl font-bold font-serif text-[#F4EBDD]">
              NadaVerse Audio Sanctuary
            </h2>
            <p className="text-xs text-[#BDB4A4] leading-relaxed">
              An unexpected musical or interface interruption occurred. The session has been protected and error telemetry captured.
            </p>
            {this.state.error?.message && (
              <div className="bg-[#11110F] border border-amber-900/30 rounded-xl p-3 text-left">
                <p className="text-[11px] font-mono text-amber-200/80 truncate">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-xl bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C7A45B]/20 cursor-pointer"
              >
                Restore NadaVerse Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
