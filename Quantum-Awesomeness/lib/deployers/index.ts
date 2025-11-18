import { parseAIResponseToFileTree } from '@/lib/fileTreeParser';

export interface DeploymentConfig {
  code: string;
  appName: string;
  framework: string;
}

export interface Deployer {
  deploy(config: DeploymentConfig, onStatus: (status: any) => void): Promise<{ url: string; logs: string[] }>;
}

export function createDeployment(platform: string): Deployer {
  const deployers: Record<string, () => Promise<Deployer>> = {
    vercel: async () => (await import('./vercel')).VercelDeployer.prototype,
    netlify: async () => (await import('./netlify')).NetlifyDeployer.prototype,
    github: async () => (await import('./github')).GitHubDeployer.prototype,
    'hugging-face': async () => (await import('./hugging-face')).HuggingFaceDeployer.prototype,
    firebase: async () => (await import('./firebase')).FirebaseDeployer.prototype,
  };

  return {
    async deploy(config, onStatus) {
      const factory = deployers[platform];
      if (!factory) {
        throw new Error(`Platform ${platform} not implemented`);
      }
      const moduleDeployer = await factory();
      // @ts-ignore - we only use the deploy method shape
      return moduleDeployer.deploy(config, onStatus);
    }
  };
}

// Simple helper for tests
export function codeToFiles(code: string) {
  return parseAIResponseToFileTree(code);
}
