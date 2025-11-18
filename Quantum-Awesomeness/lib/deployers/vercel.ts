import type { Deployer, DeploymentConfig } from './index';
import { parseAIResponseToFileTree } from '@/lib/fileTreeParser';

export const VercelDeployer: Deployer = {
  async deploy(config: DeploymentConfig, onStatus: (status: any) => void) {
    onStatus({ status: 'Preparing Vercel deployment (stubbed)...', progress: 50 });
    const files = parseAIResponseToFileTree(config.code);
    const fileCount = files.length;
    onStatus({ status: `Simulated deploy of ${fileCount} files to Vercel`, progress: 100 });
    const url = `https://${config.appName}.vercel.app`;
    return { url, logs: [`Stub deployment to ${url}`, `Files: ${fileCount}`] };
  }
};
