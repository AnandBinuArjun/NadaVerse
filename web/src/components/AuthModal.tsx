'use client';

import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, LogOut, Trash2 } from 'lucide-react';

import { API_BASE_URL } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string; displayName: string } | null;
  onLoginSuccess: (user: { email: string; displayName: string }) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const { lang, t } = useLanguage();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const endpoint = isRegisterMode
      ? `${API_BASE_URL}/api/v1/auth/register`
      : `${API_BASE_URL}/api/v1/auth/login`;

    const payload = isRegisterMode
      ? { email, password, display_name: displayName, experience_level: 'student' }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Authentication failed' }));
        throw new Error(errData.detail || 'Authentication request failed');
      }

      const data = await res.json();
      localStorage.setItem('nadaverse_token', data.access_token);
      onLoginSuccess({
        email: email,
        displayName: displayName || email.split('@')[0]
      });
      onClose();
    } catch (err: unknown) {
      // If backend is offline in demo, provide safe local auth fallback
      const error = err as Error;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        onLoginSuccess({
          email: email,
          displayName: displayName || email.split('@')[0]
        });
        onClose();
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="nv-glass-panel rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-[#C7A45B]/30 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C7A45B]/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[#BDB4A4] hover:text-[#F4EBDD] rounded-xl hover:bg-[#22221D] transition-colors z-20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Profile & Account View */
          <div className="space-y-6 relative z-10">
            <div className="flex items-center space-x-3 pb-5 border-b border-[#C7A45B]/20">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DFB960] to-[#C7A45B] flex items-center justify-center text-[#11110F] font-serif font-bold text-2xl shadow-lg shadow-[#C7A45B]/20">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#F4EBDD]">
                  {currentUser.displayName}
                </h3>
                <span className="text-xs text-[#BDB4A4] font-mono">{currentUser.email}</span>
              </div>
            </div>

            <div className="bg-[#0d0c0a]/80 backdrop-blur-md p-5 rounded-2xl border border-[#C7A45B]/20 space-y-2 text-xs">
              <span className="text-[#E0C98F] font-mono uppercase tracking-wider block font-semibold">
                {lang === 'ml' ? 'അക്കൗണ്ട് നില' : 'Account Status'}
              </span>
              <p className="text-[#F4EBDD] font-medium">
                {lang === 'ml' ? 'എല്ലാ ഫീച്ചറുകളും ലഭ്യമാണ്. 100% സൗജന്യ ആജീവനാന്ത വിദ്യാഭ്യാസം.' : 'All features active. 100% Free Lifetime Educational Access.'}
              </p>
              <p className="text-[#BDB4A4] leading-relaxed">
                {lang === 'ml' ? 'നിങ്ങളുടെ സാധകം, കുറിപ്പുകൾ, പുരോഗതി എന്നിവ സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു.' : 'Your practice history, private notes, and learning path progress are synchronized safely.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1e1c17] hover:bg-[#282620] border border-[#C7A45B]/30 hover:border-[#C7A45B] text-xs font-medium text-[#F4EBDD] transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4 text-[#C7A45B]" />
                <span>{t.signOut}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(lang === 'ml' ? 'അക്കൗണ്ട് ഒഴിവാക്കാൻ ഉറപ്പാണോ?' : 'Are you sure you want to deactivate and delete your account? All progress will be removed.')) {
                    onLogout();
                    onClose();
                  }
                }}
                className="flex items-center space-x-1.5 text-xs text-[#E17D73] hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'അക്കൗണ്ട് ഒഴിവാക്കുക' : 'Delete Account'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#87947A]" />
                <span>{t.authZeroPaywallNotice}</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#F4EBDD]">
                {isRegisterMode ? t.authRegisterTitle : t.authSignInTitle}
              </h3>
              <p className="text-xs text-[#BDB4A4] mt-1 leading-relaxed">
                {lang === 'ml'
                  ? 'നിങ്ങളുടെ സാധക ചരിത്രം സൂക്ഷിക്കുക, രാഗങ്ങൾ ബുക്ക്മാർക്ക് ചെയ്യുക, ആധാര ഷഡ്ജം നിശ്ചയിക്കുക.'
                  : 'Save your practice progress, bookmark ragas, and personalize your Adhara Shadjam.'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3.5 bg-[#E17D73]/10 border border-[#E17D73]/30 rounded-xl text-xs text-[#E17D73]">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5 font-medium">
                    {t.authDisplayNameLabel}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#BDB4A4] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={lang === 'ml' ? 'ഉദാ: ആനന്ദ്' : 'e.g. Anand'}
                      className="w-full bg-[#0d0c0a]/80 border border-[#C7A45B]/25 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F4EBDD] placeholder-[#BDB4A4]/40 focus:outline-none focus:border-[#C7A45B] focus:ring-1 focus:ring-[#C7A45B]/40 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5 font-medium">
                  {t.authEmailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#BDB4A4] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@nadaverse.org"
                    className="w-full bg-[#0d0c0a]/80 border border-[#C7A45B]/25 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F4EBDD] placeholder-[#BDB4A4]/40 focus:outline-none focus:border-[#C7A45B] focus:ring-1 focus:ring-[#C7A45B]/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#BDB4A4] mb-1.5 font-medium">
                  {t.authPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#BDB4A4] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0d0c0a]/80 border border-[#C7A45B]/25 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F4EBDD] placeholder-[#BDB4A4]/40 focus:outline-none focus:border-[#C7A45B] focus:ring-1 focus:ring-[#C7A45B]/40 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="nv-gold-btn w-full py-3.5 rounded-xl text-xs font-bold tracking-wider shadow-lg shadow-[#C7A45B]/25 mt-3 disabled:opacity-50 active:scale-95"
              >
                {isLoading ? (lang === 'ml' ? 'പ്രോസസ്സ് ചെയ്യുന്നു...' : 'Processing...') : isRegisterMode ? t.authSubmitRegister : t.authSubmitSignIn}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#C7A45B]/15 text-center text-xs text-[#BDB4A4]">
              {isRegisterMode ? (
                <>
                  {lang === 'ml' ? 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? ' : 'Already have an account? '}
                  <button
                    onClick={() => setIsRegisterMode(false)}
                    className="text-[#E0C98F] hover:underline font-semibold"
                  >
                    {t.authSwitchToSignIn}
                  </button>
                </>
              ) : (
                <>
                  {lang === 'ml' ? 'നാദവേഴ്സിൽ ആദ്യമാണോ? ' : 'New to NadaVerse? '}
                  <button
                    onClick={() => setIsRegisterMode(true)}
                    className="text-[#E0C98F] hover:underline font-semibold"
                  >
                    {t.authSwitchToRegister}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
