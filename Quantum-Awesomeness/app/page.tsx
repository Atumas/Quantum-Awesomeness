'use client';

import { useState, useEffect } from 'react';
import ChatPanel from '@/components/ChatPanel';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import DeploymentHub from '@/components/DeploymentHub';
import VoiceInput from '@/components/VoiceInput';
import EasterEgg from '@/components/EasterEgg';
import DeployYourselfButton from '@/components/DeployYourselfButton';
import DeployAppForgeButton from '@/components/DeployAppForgeButton';
import { initializeAnalytics, trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { AutoDebugger } from '@/lib/auto-debugger';
import { useToast } from '@/components/Toaster';
import { collab } from '@/lib/partykit';

export default function AppForge() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [framework, setFramework] = useState('react');
  const [appName, setAppName] = useState('my-app');
  const [showVoice] = useState(false); // reserved for future toggle UI
  const [quantumMode, setQuantumMode] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    initializeAnalytics();
    trackEvent(ANALYTICS_EVENTS.APP_LOADED);

    try {
      if (typeof window !== 'undefined' && localStorage.getItem('appforge-debugger') === 'true') {
        AutoDebugger.getInstance().listenForErrors();
      }
    } catch {
      // ignore
    }

    try {
      if (typeof window !== 'undefined' && localStorage.getItem('appforge-quantum') === 'true') {
        setQuantumMode(true);
        addToast({
          type: 'info',
          message: '⚛️ Quantum Mode: Multi-AI synthesis enabled'
        });
      }
    } catch {
      // ignore
    }

    collab.connect((data) => {
      if (data.type === 'CODE_CHANGE' && data.user && data.user.id !== 'self') {
        addToast({
          type: 'info',
          message: `${data.user.name} is editing...`
        });
      }
    });

    return () => collab.disconnect();
  }, [addToast]);

  const handleFrameworkChange = (newFramework: string) => {
    setFramework(newFramework);
    trackEvent(ANALYTICS_EVENTS.FRAMEWORK_CHANGED, { framework: newFramework });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      <EasterEgg />
      <DeployYourselfButton />
      <DeployAppForgeButton />

      {quantumMode && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            ⚛️ QUANTUM
          </div>
        </div>
      )}

      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            ⚡ AppForge AI 2.0
          </h1>
          <p className="text-xs text-slate-400 mt-1">From idea to app in 60 seconds</p>
        </div>

        <div className="flex gap-3 items-center">
          <VoiceInput />

          <select
            value={framework}
            onChange={(e) => handleFrameworkChange(e.target.value)}
            className="forge-input"
          >
            <option value="react">React 18</option>
            <option value="vue">Vue 3</option>
            <option value="svelte">Svelte 5</option>
            <option value="vanilla">Vanilla JS</option>
          </select>

          <input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="App name"
            className="forge-input w-32"
          />

          <button
            onClick={() => {
              try {
                const enabled = !localStorage.getItem('appforge-debugger');
                localStorage.setItem('appforge-debugger', enabled ? 'true' : 'false');
                addToast({
                  type: 'info',
                  message: enabled ? '🐞 Auto-debugger enabled' : '🐞 Auto-debugger disabled'
                });
              } catch {
                // ignore
              }
            }}
            className="px-3 py-2 text-xs bg-slate-800 rounded-lg hover:bg-slate-700 transition"
            title="Toggle auto-debugger"
          >
            🐞
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-1">
          <ChatPanel 
            onCodeGenerated={(code) => {
              setGeneratedCode(code);
              trackEvent(ANALYTICS_EVENTS.APP_GENERATED, {
                framework,
                linesOfCode: code.split('\n').length
              });
            }}
            framework={framework}
            appName={appName}
            quantumMode={quantumMode}
          />
        </div>

        <div className="lg:col-span-1">
          <CodeEditor 
            code={generatedCode} 
            onChange={setGeneratedCode}
            onCodeChange={(code) => {
              collab.broadcastCodeChange(code, { line: 0, column: 0 });
            }}
          />
        </div>

        <div className="lg:col-span-1">
          <LivePreview code={generatedCode} framework={framework} />
        </div>
      </div>

      <footer className="border-t border-slate-800 p-4 bg-slate-900/50">
        <DeploymentHub 
          code={generatedCode}
          appName={appName}
          framework={framework}
          quantumMode={quantumMode}
        />
      </footer>

      <div className="sr-only">
        Press Ctrl+Shift+V for voice input, Ctrl+Shift+D for debugger
      </div>
    </div>
  );
}
