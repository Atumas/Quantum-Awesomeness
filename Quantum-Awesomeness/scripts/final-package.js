const fs = require('fs-extra');
const path = require('path');
const JSZip = require('jszip');
const chalk = require('chalk');
const { createDistributionZip } = require('./package-for-distribution');

console.log(chalk.cyan.bold('\n🎁 FINAL PACKAGING: APPFORGE AI v2.0\n'));

async function createFinalPackage() {
  // Step 1: Create the main distribution
  await createDistributionZip();

  // Step 2: Create enhanced package with global installer
  const zip = new JSZip();
  const existingZip = await fs.readFile('appforge-ai-v2.0.zip');
  await zip.loadAsync(existingZip);

  // Add global install scripts
  zip.file('install-global.sh', `#!/bin/bash
echo "🚀 Installing AppForge AI v2.0 globally..."
npm install -g ./appforge-ai-v2.0.zip
echo ""
echo "✅ Installation complete!"
echo ""
echo "📚 Quick Start:"
echo "  appforge create my-app"
echo "  appforge interactive"
echo "  appforge --help"
echo ""
echo "🌐 Then open http://localhost:3000"
`);

  zip.file('install-global.bat', `@echo off
echo 🚀 Installing AppForge AI v2.0 globally...
npm install -g .\\appforge-ai-v2.0.zip
echo.
echo ✅ Installation complete!
echo.
echo 📚 Quick Start:
echo   appforge create my-app
echo   appforge interactive
echo   appforge --help
echo.
echo 🌐 Then open http://localhost:3000
`);

  // Add quick-start guide
  zip.file('QUICKSTART.md', `# 🎯 AppForge AI - 60-Second Start

## Option 1: Global CLI (Recommended)
\`\`\`bash
./install-global.sh  # or install-global.bat on Windows
appforge create my-app --framework react --persona startup
cd my-app && npm run dev
\`\`\`

## Option 2: Local Development
\`\`\`bash
npm install
npm run dev
# Open http://localhost:3000
\`\`\`

## Option 3: Deploy to Cloud
\`\`\`bash
# The platform can deploy ITSELF to Hugging Face!
npm run dev
# Click "🪞 Deploy AppForge to HF" button
\`\`\`

## 🎮 Keyboard Shortcuts
- \`Ctrl+Shift+V\`: Voice Input
- \`Ctrl+Shift+D\`: Toggle Auto-Debugger
- \`↑↑↓↓←→←→BA\`: Unlock Quantum Mode

## 🌍 Surprising Features
- 5 Deployment Platforms (Vercel, Netlify, GitHub, Hugging Face, Firebase)
- Live Preview at 60fps
- Figma-to-App Conversion
- Auto-Debugger (AI fixes runtime errors)
- Voice-to-App Creation
- A/B Test Variant Generator
- Monetization Integration
- Multi-User Collaboration
- Quantum Mode (multi-AI synthesis)
- Easter Eggs & Secrets

## 📊 Analytics
Add to \`.env.local\`:
\`\`\`
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-id
SENTRY_DSN=your-sentry-dsn
\`\`\`

Have fun surprising the world! 🎉
`);

  // Step 3: Generate final ZIP
  console.log(chalk.yellow('📦 Creating final distribution package...'));
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  const finalPath = path.join(process.cwd(), 'appforge-ai-v2.0-FINAL.zip');
  await fs.writeFile(finalPath, content);

  // Step 4: Create one-liner install script
  const oneLiner = `npx degit appforge/ai#v2.0 && cd appforge-ai && npm install && npm run dev`;
  await fs.writeFile('ONE-LINE-INSTALL.txt', oneLiner);

  // Step 5: Print success summary
  console.log(chalk.green.bold('\n✅ PACKAGING COMPLETE!\n'));
  console.log(chalk.white(`📊 Final Package: ${(content.length / 1024 / 1024).toFixed(2)} MB`));
  console.log(chalk.white(`📁 Location: ${finalPath}`));
  console.log(chalk.cyan(`\n🚀 ONE-LINE INSTALL:\n${chalk.bold(oneLiner)}\n`));

  console.log(chalk.yellow.bold('📚 Distribution Methods:'));
  console.log(chalk.white(`
1. ZIP Distribution: Share appforge-ai-v2.0-FINAL.zip
2. NPM Registry: npm publish (cli package)
3. GitHub: Push and use npx degit
4. Hugging Face: Deploy the platform itself
5. Docker: Coming in v2.1
  `));

  console.log(chalk.green.bold('\n🎯 Next Steps:'));
  console.log(chalk.white(`
✅ Test locally: npm run dev
✅ Test CLI: npm link && appforge --help
✅ Deploy to HF: Click "🪞 Deploy AppForge to HF" button
✅ Share with world: Post on Product Hunt, HN, Twitter
✅ Collect feedback & iterate
  `));

  console.log(chalk.cyan.bold('\n🌍 Ready to surprise the world!\n'));
}

// Execute if run directly
if (require.main === module) {
  createFinalPackage().catch(console.error);
}

module.exports = { createFinalPackage };
