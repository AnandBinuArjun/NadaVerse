'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const PWARegistration: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            registration.update().catch(() => {});
          })
          .catch((err) => {
            console.debug('ServiceWorker registration error:', err);
          });
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 bg-[#161410] border border-[#C7A45B]/60 text-[#F4EBDD] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs backdrop-blur-md animate-fade-in font-mono"
    >
      <WifiOff className="w-4 h-4 text-[#C7A45B] animate-pulse" />
      <span>Offline Mode active: Tanpura, Tala & Ragas running 100% locally</span>
    </div>
  );
};
