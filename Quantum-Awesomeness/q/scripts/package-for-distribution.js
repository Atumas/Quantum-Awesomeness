const fs = require('fs-extra');
const path = require('path');
const JSZip = require('jszip');

async function createDistributionZip() {
  console.log('📦 Packaging AppForge AI 2.0 for distribution...');

  const zip = new JSZip();
  const projectRoot = process.cwd();

  const patterns = [
    'app',
    'components',
    'lib',
    'bin',
    'scripts',
    'public',
  ];

  for (const dir of patterns) {
    const dirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(dirPath)) continue;
    const walk = (p) => {
      const entries = fs.readdirSync(p, { withFileTypes: true });
      for (const entry of entries) {
        const fp = path.join(p, entry.name);
        if (entry.isDirectory()) {
          walk(fp);
        } else {
          const rel = path.relative(projectRoot, fp);
          zip.file(rel, fs.readFileSync(fp));
        }
      }
    };
    walk(dirPath);
  }

  const extraFiles = [
    'package.json',
    'tailwind.config.js',
    'next.config.js',
    'tsconfig.json',
    '.env.example',
    'next-env.d.ts',
    'README.md'
  ];

  for (const file of extraFiles) {
    const fp = path.join(projectRoot, file);
    if (fs.existsSync(fp)) {
      zip.file(file, fs.readFileSync(fp));
    }
  }

  const readme = `# 🚀 AppForge AI 2.0 - "The World Surpriser"

## Quick Start

\`\`\`bash
unzip appforge-ai-v2.0.zip
cd appforge-ai-v2.0
npm install
npm run dev
\`\`\`
`;

  zip.file('README.md', readme);

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  const outputPath = path.join(projectRoot, 'appforge-ai-v2.0.zip');
  fs.writeFileSync(outputPath, content);

  console.log(`✅ Distribution package created: ${outputPath}`);
  console.log(`📊 Size: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
}

if (require.main === module) {
  createDistributionZip().catch(console.error);
}

module.exports = { createDistributionZip };
