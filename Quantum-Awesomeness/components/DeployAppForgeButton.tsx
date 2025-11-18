'use client';

import { useState } from 'react';
import { createDeployment } from '@/lib/deployers';
import { useToast } from '@/components/Toaster';

export default function DeployAppForgeButton() {
  const [deploying, setDeploying] = useState(false);
  const toast = useToast();

  const deploySelf = async () => {
    try {
      setDeploying(true);

      // 1. Fetch self code (stubbed endpoint)
      const response = await fetch('/api/get-appforge-code');
      const { code } = await response.json();

      // 2. Use the generic Hugging Face deployer (simulated)
      const deployer = createDeployment('hugging-face');
      const result = await deployer.deploy(
        {
          code,
          appName: `appforge-ai-${Date.now()}`,
          framework: 'react',
        },
        () => {}
      );

      toast.addToast({
        type: 'success',
        message: `🌍 AppForge deployed (simulated) to: ${result.url}`,
      });
      alert(
        '🌍 AppForge has been deployed to Hugging Face (simulated)!\n\nShare the URL to surprise the world: ' +
          result.url
      );
    } catch (e: any) {
      toast.addToast({
        type: 'error',
        message: `Deployment failed: ${e.message}`,
      });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <button
      onClick={deploySelf}
      disabled={deploying}
      className="fixed bottom-20 left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 z-40"
    >
      {deploying ? '🚀 Deploying...' : '🪞 Deploy AppForge to HF'}
    </button>
  );
}
