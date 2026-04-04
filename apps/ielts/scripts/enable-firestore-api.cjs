/**
 * Enable Firestore API on Google Cloud
 * Uses the Firebase service account credentials
 */

const admin = require('firebase-admin');
const { GoogleAuth } = require('google-auth-library');

const SERVICE_ACCOUNT = require('../suri-learning-firebase-adminsdk-fbsvc-d7070ab1ac.json');
const PROJECT_ID = SERVICE_ACCOUNT.project_id;
const FIRESTORE_API = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)';

async function enableFirestore() {
  console.log('\n🔌 Enabling Cloud Firestore API...\n');

  const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  try {
    // First, try to access Firestore to trigger API enablement
    const client = await auth.getClient();
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default):get`;

    const response = await client.request({
      url,
      method: 'GET',
    });

    console.log('✅ Firestore API is enabled and accessible!');
    console.log('   Database info:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (e) {
    const status = e.response?.status;
    const data = e.response?.data?.error;

    if (status === 404 || (data && data.message?.includes('API'))) {
      console.log('   ⚠️  Firestore API is not enabled yet.');
      console.log('   This can only be enabled via the Google Cloud Console.');
      console.log('\n   📋 Please do the following:\n');
      console.log('   1. Open: https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=' + PROJECT_ID);
      console.log('   2. Click "Enable" button at the top');
      console.log('   3. Wait 2-3 minutes for propagation');
      console.log('   4. Then run: node scripts/firebase-admin-setup.cjs\n');
    } else {
      console.error('   ❌ Error:', e.response?.data?.error?.message || e.message);
    }
    return false;
  }
}

async function enableAPIViaDiscovery() {
  console.log('\n🔌 Attempting to enable Firestore API via Cloud Resource Manager...\n');

  const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  try {
    const client = await auth.getClient();

    // Try to enable via services API
    const response = await client.request({
      url: `https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/firestore.googleapis.com:enable`,
      method: 'POST',
      data: {},
    });

    console.log('✅ Firestore API enabled successfully!');
    console.log('   Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (e) {
    const status = e.response?.status;
    const msg = e.response?.data?.error?.message || e.message;

    if (status === 409 || msg.includes('already enabled') || msg.includes('enabled')) {
      console.log('   ✅ Firestore API is already enabled on this project!');
      return true;
    }

    console.log('   ⚠️  Could not auto-enable Firestore API.');
    console.log('   Error:', msg);
    console.log('\n   📋 Manual steps required:');
    console.log('   1. Go to: https://console.cloud.google.com/apis/api/firestore.googleapis.com/overview?project=' + PROJECT_ID);
    console.log('   2. Click "Enable"');
    return false;
  }
}

async function main() {
  console.log(`\n🔧 Google Cloud API Setup for: ${PROJECT_ID}\n`);

  const enabled = await enableAPIViaDiscovery();

  if (enabled) {
    console.log('\n✅ Firestore API is ready!');
    console.log('   Next: Create database in Firebase Console:\n');
    console.log('   1. Go to: https://console.firebase.google.com/project/' + PROJECT_ID + '/firestore');
    console.log('   2. Click "Create database"');
    console.log('   3. Choose "Start in test mode" (for dev)');
    console.log('   4. Select a location close to your users');
    console.log('   5. Then run: node scripts/firebase-admin-setup.cjs\n');
  }
}

main();
