'use client';

import { useEffect, useState } from 'react';

// Konami Code Easter Egg: ↑↑↓↓←→←→BA
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export default function EasterEgg() {
  const [unlocked, setUnlocked] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (JSON.stringify(next) === JSON.stringify(KONAMI)) {
          setUnlocked(true);
          try {
            localStorage.setItem('appforge-quantum', 'true');
          } catch {
            // ignore
          }
          alert(
            '🎉 QUANTUM MODE UNLOCKED!\n\nYour apps will now conceptually use multiple AI models in synthesis mode.'
          );
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!unlocked) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-2xl">
        ⚛️ QUANTUM MODE ACTIVE
      </div>
    </div>
  );
}
