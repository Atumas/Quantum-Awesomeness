#!/usr/bin/env node

const { Command } = require('commander');
const fetch = require('node-fetch');
const chalk = require('chalk');

const program = new Command();

program
  .name('appforge')
  .description('AI-powered app generator CLI')
  .version('2.0.0');

program
  .command('create <app-name>')
  .description('Create a new app with AI via local AppForge instance')
  .option('-f, --framework <framework>', 'Framework to use', 'react')
  .option('-p, --persona <persona>', 'Development persona', 'startup')
  .action(async (appName, options) => {
    console.log(chalk.blue(`🔥 Creating ${appName} with AppForge AI...`));

    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: `Create a ${options.framework} app` }],
        framework: options.framework,
        appName,
        userType: options.persona
      })
    });

    if (!response.ok) {
      console.error(chalk.red('API call failed'), await response.text());
      return;
    }

    console.log(chalk.green('✅ App generation request sent. Inspect UI for results.'));
  });

program
  .command('deploy <platform>')
  .description('Deploy app to a given platform (simulated in v2)')
  .action(async (platform) => {
    console.log(chalk.yellow(`📡 Deployment command for ${platform} is UI-driven in v2.0`));
  });

program.parse();
