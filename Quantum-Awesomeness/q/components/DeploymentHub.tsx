'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { parseAIResponseToFileTree } from '@/lib/fileTreeParser';
import { createDeployment } from '@/lib/deployers';
import { useToast } from '@/components/Toaster';

const PLATFORMS = [
  { id: 'vercel', name: 'Vercel', icon: '▲', color: 'bg-black', ready: true },
  { id: 'netlify', name: 'Netlify', icon: '✓', color: 'bg-teal-600', ready: true },
  { id: 'github', name: 'GitHub', icon: '🐙', color: 'bg-gray-800', ready: true },
  { id: 'hugging-face', name: 'Hugging Face', icon: '🤗', color: 'bg-yellow-400', ready: true },
  { id: 'firebase', name: 'Firebase', icon: '🔥', color: 'bg-orange-500', ready: true },
];

interface Props {
  code: string;
  appName: string;
  framework: string;
  quantumMode?: boolean;
}

export default function DeploymentHub({ code, appName, framework, quantumMode }: Props) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const toast = useToast();

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const downloadZIP = async () => {
    try {
      const files = parseAIResponseToFileTree(code);
      const zip = new JSZip();
      const folder = zip.folder(appName || 'appforge-project');

      if (files.length === 0) {
        folder?.file('App.tsx', code || 'export default function App() { return <div>Empty project</div>; }');
      } else {
        files.forEach(file => folder?.file(file.path, file.content));
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${appName || 'appforge-project'}.zip`);
      toast.addToast({ type: 'success', message: 'ZIP generated successfully' });
    } catch (e: any) {
      toast.addToast({ type: 'error', message: `ZIP failed: ${e.message}` });
    }
  };

  const deployAll = async () => {
    setDeploying(true);
    const results: any[] = [];

    for (const platform of selectedPlatforms) {
      try {
        const deployer = createDeployment(platform);
        const result = await deployer.deploy(
          { code, appName, framework },
          (update) => setStatus({ platform, ...update })
        );
        results.push({ platform, success: true, url: result.url });
      } catch (error: any) {
        results.push({ platform, success: false, error: error.message });
      }
    }

    setDeploying(false);
    if (results.some(r => r.success)) {
      toast.addToast({ type: 'success', message: quantumMode ? 'Quantum deployment simulation completed' : 'Deployment simulation completed' });
    } else {
      toast.addToast({ type: 'error', message: 'Deployment failed' });
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {quantumMode ? '🚀 World Deployment (Quantum Simulation)' : '🚀 Multi-Platform Deployment'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={downloadZIP}
            className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-sm transition"
          >
            📦 Download ZIP
          </button>
          <button
            onClick={deployAll}
            disabled={deploying || selectedPlatforms.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-600 disabled:opacity-50 px-4 py-1 rounded-lg text-sm font-semibold hover:opacity-90 transition"
          >
            {deploying ? 'Deploying...' : `Deploy to ${selectedPlatforms.length} platforms`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-4">
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            onClick={() => p.ready && togglePlatform(p.id)}
            disabled={!p.ready}
            className={`p-3 rounded-lg border-2 transition ${
              selectedPlatforms.includes(p.id)
                ? 'border-blue-500 bg-blue-900/30'
                : 'border-slate-600 bg-slate-700/50'
            } hover:border-slate-400`}
          >
            <div className={`${p.color} w-8 h-8 rounded flex items-center justify-center mx-auto mb-1`}>
              <span className="text-white font-bold">{p.icon}</span>
            </div>
            <div className="text-xs">{p.name}</div>
          </button>
        ))}
      </div>

      {status && (
        <div className="bg-slate-900 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm">
              {status.platform}: {status.status}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${status.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
