/**
 * Stitch Setup Script for Suri Learning
 *
 * Usage:
 *   1. Run: node scripts/stitch-setup.cjs
 *   2. Follow the prompts to authenticate and create a Stitch project
 *   3. Copy the STITCH_API_KEY and STITCH_PROJECT_ID to .env.local
 *
 * Prerequisites:
 *   - Node.js 18+
 *   - Google account with access to stitch.withgoogle.com
 *   - gcloud CLI installed (https://cloud.google.com/sdk/docs/install)
 *     Run: gcloud auth login && gcloud auth application-default login
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log('\n=== Stitch Setup for Suri Learning ===\n');
  console.log('This script helps you:');
  console.log('  1. Enable Stitch API in Google Cloud');
  console.log('  2. Create a Stitch project');
  console.log('  3. Generate API key and project ID');
  console.log('\n');

  // Check if @google/stitch-sdk is installed
  try {
    require('@google/stitch-sdk');
    console.log('[OK] @google/stitch-sdk is installed');
  } catch {
    console.log('[ERROR] @google/stitch-sdk not found. Run: npm install @google/stitch-sdk');
    process.exit(1);
  }

  // Check for gcloud
  const { execSync } = require('child_process');
  let gcloudAvailable = false;
  try {
    execSync('gcloud --version', { stdio: 'pipe' });
    gcloudAvailable = true;
    console.log('[OK] gcloud CLI is installed');
  } catch {
    console.log('[WARN] gcloud CLI not found. API key method will be used instead.');
  }

  // Get Google Cloud Project ID
  let projectId = process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId && gcloudAvailable) {
    try {
      projectId = execSync('gcloud config get-value project', { encoding: 'utf8' }).trim();
    } catch {
      // ignore
    }
  }

  if (!projectId) {
    console.log('\n');
    projectId = await prompt('Enter your Google Cloud Project ID: ');
  }

  if (!projectId) {
    console.log('[ERROR] Project ID is required.');
    console.log('  Get one free at: https://console.cloud.google.com/projectcreate');
    process.exit(1);
  }

  console.log(`\nUsing project: ${projectId}`);

  // Enable Stitch API
  if (gcloudAvailable) {
    const enable = await prompt('\nEnable Stitch API in Google Cloud? (y/n): ');
    if (enable.toLowerCase() === 'y') {
      console.log('Running: gcloud beta services mcp enable stitch.googleapis.com ...');
      try {
        execSync(`gcloud beta services mcp enable stitch.googleapis.com --project=${projectId}`, {
          stdio: 'inherit',
        });
        console.log('[OK] Stitch API enabled');
      } catch (err) {
        console.log('[WARN] Could not enable API automatically.');
        console.log('  Enable manually at: https://console.cloud.google.com/apis/library/stitch.googleapis.com');
      }
    }
  }

  // Create Stitch project
  console.log('\n');
  console.log('=== Creating Stitch Project ===');
  console.log('Open https://stitch.withgoogle.com/ and create a project named "Suri Learning"');
  console.log('Then copy your Project ID from the URL (e.g. https://stitch.withgoogle.com/PROJECT_ID)');
  console.log('\n');

  const stitchProjectId = await prompt('Enter your Stitch Project ID (from URL): ');

  if (!stitchProjectId) {
    console.log('[WARN] Skipping project setup. You can set STITCH_PROJECT_ID manually later.');
  }

  // Generate API key
  console.log('\n');
  console.log('=== Getting API Key ===');
  console.log('1. Go to: https://console.cloud.google.com/apis/credentials?project=' + projectId);
  console.log('2. Click "Create Credentials" → "API Key"');
  console.log('3. Copy the key (starts with AIza...)');
  console.log('\n');

  const apiKey = await prompt('Enter your Google Cloud API Key (or press Enter to skip): ');

  // Output results
  console.log('\n');
  console.log('=== Setup Complete ===\n');
  console.log('Add these to your .env.local file:\n');

  const envContent = [];
  if (apiKey) {
    envContent.push(`STITCH_API_KEY=${apiKey}`);
    console.log(`STITCH_API_KEY=${apiKey}`);
  }
  if (stitchProjectId) {
    envContent.push(`STITCH_PROJECT_ID=${stitchProjectId}`);
    console.log(`STITCH_PROJECT_ID=${stitchProjectId}`);
  }
  if (projectId) {
    console.log(`GOOGLE_CLOUD_PROJECT=${projectId}`);
    envContent.push(`GOOGLE_CLOUD_PROJECT=${projectId}`);
  }

  if (envContent.length > 0) {
    console.log('\n');
    console.log('=== MCP Server Setup ===\n');
    console.log('Add this to your Cursor MCP settings file:');
    console.log('  %APPDATA%/Cursor/User/globalStorage/user-data/mcp.json');
    console.log('\n');
    console.log(JSON.stringify({
      mcpServers: {
        stitch: {
          command: 'npx',
          args: ['-y', '@_davideast/stitch-mcp', 'proxy']
        }
      }
    }, null, 2));
  }

  // Write to .env.local
  const fs = require('fs');
  const envPath = '.env.local';
  let existingContent = '';
  try {
    existingContent = fs.readFileSync(envPath, 'utf8');
  } catch {
    // file doesn't exist
  }

  const updates = [];
  if (apiKey) updates.push(`STITCH_API_KEY=${apiKey}`);
  if (stitchProjectId) updates.push(`STITCH_PROJECT_ID=${stitchProjectId}`);
  if (projectId) updates.push(`GOOGLE_CLOUD_PROJECT=${projectId}`);

  if (updates.length > 0) {
    const newContent = existingContent
      ? existingContent.trimEnd() + '\n' + updates.join('\n') + '\n'
      : updates.join('\n') + '\n';
    fs.writeFileSync(envPath, newContent);
    console.log(`\n[OK] Written to ${envPath}`);
  }

  rl.close();
  console.log('\nDone!');
}

main().catch((err) => {
  console.error('\n[ERROR]', err.message);
  rl.close();
  process.exit(1);
});
