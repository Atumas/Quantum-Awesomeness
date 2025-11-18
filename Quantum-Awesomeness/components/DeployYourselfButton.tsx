'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toaster';

export default function DeployYourselfButton() {
  const [clicked, setClicked] = useState(false);
  const toast = useToast();

  const handleClick = () => {
    setClicked(true);
    toast.addToast({
      type: 'info',
      message: '🧠 Meta: Imagine AppForge deploying its own UI as a template.'
    });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 left-4 z-40 bg-slate-800 border border-slate-600 px-3 py-1 rounded-full text-xs text-slate-200 hover:bg-slate-700"
    >
      {clicked ? 'Deployed (Concept)' : 'Deploy This UI as Template'}
    </button>
  );
}
