import type { Deployer, DeploymentConfig } from './index';
import { parseAIResponseToFileTree } from '@/lib/fileTreeParser';

export const FirebaseDeployer: Deployer = {
  async deploy(config: DeploymentConfig, onStatus: (status: any) => void) {
    onStatus({ status: 'Preparing Firebase Hosting deploy (stubbed)...', progress: 50 });
    const files = parseAIResponseToFileTree(config.code);
    const fileCount = files.length;
    onStatus({ status: `Simulated deploy of ${fileCount} files to Firebase`, progress: 100 });
    const url = `https://${config.appName}.web.app`;
    return { url, logs: [`Stub Firebase site at ${url}`, `Files: ${fileCount}`] };
  }
};
