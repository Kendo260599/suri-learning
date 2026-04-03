/**
 * Firebase Management Script
 * Authenticates via Firebase Admin service account and performs auto-setup
 */

const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

const SERVICE_ACCOUNT = require('../suri-learning-firebase-adminsdk-fbsvc-d7070ab1ac.json');
const PROJECT_ID = SERVICE_ACCOUNT.project_id;

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  if (!tokenResponse.token) {
    throw new Error('Failed to get access token');
  }
  return tokenResponse.token;
}

async function enableService(token) {
  console.log('\n🔌 Enabling Cloud Firestore API...\n');
  const res = await fetch(
    `https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/firestore.googleapis.com:enable`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );
  const data = await res.json();
  if (res.ok) {
    console.log('✅ Firestore API enabled successfully!');
    return true;
  } else {
    const msg = data.error?.message || JSON.stringify(data);
    if (msg.includes('already enabled') || res.status === 409) {
      console.log('   ✅ Firestore API is already enabled!');
      return true;
    }
    console.log('   ⚠️  Could not auto-enable Firestore API.');
    console.log('   Error:', msg);
    return false;
  }
}

async function checkFirestore(token) {
  console.log('\n3️⃣  Firestore Database Check...\n');
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const data = await res.json();
      console.log('   ✅ Firestore database exists!');
      console.log('   Location:', data.location);
      console.log('   Type:', data.type);
      return true;
    } else if (res.status === 404) {
      console.log('   ⚠️  Firestore database not found yet.');
      return false;
    } else {
      const data = await res.json();
      console.log('   ⚠️  Could not check Firestore:', data.error?.message);
      return false;
    }
  } catch (e) {
    console.log('   ⚠️  Could not check Firestore:', e.message);
    return false;
  }
}

async function createFirestoreDatabase(token, location = 'us-central') {
  console.log(`\n🗄️  Creating Firestore Database (location: ${location})...\n`);
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases?databaseId=(default)`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'FIRESTORE_NATIVE',
          locationId: location,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log('   ✅ Firestore database created successfully!');
      console.log('   Location:', data.location);
      console.log('   Type:', data.type);
      return true;
    } else {
      const msg = data.error?.message || JSON.stringify(data);
      if (msg.includes('already exists') || msg.includes('already been created')) {
        console.log('   ✅ Database already exists!');
        return true;
      }
      console.log('   ⚠️  Could not create database.');
      console.log('   Error:', msg);
      console.log('   Response status:', res.status);
      return false;
    }
  } catch (e) {
    console.log('   ⚠️  Could not create database:', e.message);
    return false;
  }
}

async function checkAuthConfig(token) {
  console.log('\n4️⃣  Authentication Config...\n');
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/config`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) {
      const config = await res.json();
      const providers = (config.signIn || {}).config || [];
      const enabledProviders = providers.filter(p => p.enabled).map(p => p.provider);
      console.log('   ✅ Auth config retrieved.');
      console.log('   Enabled providers:', enabledProviders.length ? enabledProviders.join(', ') : '(none)');
      const domains = config.authorizedDomains || [];
      console.log('   Authorized domains:', domains.length ? domains.join(', ') : '(none)');
      return config;
    } else {
      const data = await res.json();
      console.log('   ⚠️  Could not fetch auth config:', res.status);
      console.log('   Response:', JSON.stringify(data).substring(0, 200));
      return null;
    }
  } catch (e) {
    console.log('   ⚠️  Could not fetch auth config:', e.message);
    return null;
  }
}

async function enableAuthAPI(token) {
  console.log('\n🔑 Enabling Firebase Authentication API...\n');
  const apis = [
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
  ];
  for (const api of apis) {
    try {
      const res = await fetch(
        `https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/${api}:enable`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(`   ✅ ${api} enabled!`);
      } else {
        const msg = data.error?.message || JSON.stringify(data);
        if (msg.includes('already enabled') || res.status === 409) {
          console.log(`   ✅ ${api} already enabled!`);
        } else {
          console.log(`   ⚠️  ${api}:`, msg.substring(0, 100));
        }
      }
    } catch (e) {
      console.log(`   ⚠️  ${api}:`, e.message);
    }
  }
}

async function updateAuthConfig(token, config) {
  console.log('\n🔧 Updating Authentication Config...\n');
  try {
    const patchRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/config?updateMask=signIn.config,authorizedDomains`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      }
    );
    const data = await patchRes.json();
    if (patchRes.ok) {
      console.log('   ✅ Auth config updated!');
      return true;
    } else {
      const msg = data.error?.message || JSON.stringify(data);
      if (patchRes.status === 404) {
        console.log('   ⚠️  Auth config not found (need Firebase Auth enabled first).');
        console.log('      This is normal - Firebase Auth needs to be enabled via Firebase Console.');
      } else {
        console.log('   ⚠️  Could not update auth config:', msg);
      }
      return false;
    }
  } catch (e) {
    console.log('   ⚠️  Could not update auth config:', e.message);
    return false;
  }
}

async function deployFirestoreRules(token) {
  console.log('\n5️⃣  Deploying Firestore Security Rules...\n');
  const rulesContent = require('fs').readFileSync(
    path.join(__dirname, '..', 'firestore.rules'),
    'utf8'
  );
  try {
    // First get current rules
    const getRes = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!getRes.ok && getRes.status !== 404) {
      const data = await getRes.json();
      // If API not enabled, enable it
      if (getRes.status === 403 || data.error?.message?.includes('not enabled')) {
        console.log('   ⚠️  Firebase Rules API needs to be enabled manually.');
        console.log('   📋 Go to: https://console.cloud.google.com/apis/api/firebaserules.googleapis.com/overview?project=' + PROJECT_ID);
        console.log('   Then run: firebase deploy --only firestore:rules\n');
        return false;
      }
    }

    // Try to create/update ruleset
    const rulesetRes = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: {
            files: [{
              name: 'firestore.rules',
              content: rulesContent,
            }],
          },
        }),
      }
    );
    const rulesetData = await rulesetRes.json();
    if (rulesetRes.ok) {
      console.log('   ✅ Ruleset created:', rulesetData.name);
      // Same as firebase-tools lib/gcp/rules.js updateRelease (no query updateMask)
      const releaseShortName = 'cloud.firestore';
      const releaseFullName = `projects/${PROJECT_ID}/releases/${releaseShortName}`;
      const patchRes = await fetch(
        `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases/${releaseShortName}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            release: {
              name: releaseFullName,
              rulesetName: rulesetData.name,
            },
          }),
        }
      );
      if (patchRes.ok) {
        console.log('   ✅ Firestore rules deployed successfully!');
        return true;
      }
      const patchErr = await patchRes.json().catch(() => ({}));
      const patchMsg = patchErr.error?.message || JSON.stringify(patchErr);
      // First deploy: no release yet — create it
      const releaseRes = await fetch(
        `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: releaseFullName,
            rulesetName: rulesetData.name,
          }),
        }
      );
      if (releaseRes.ok) {
        console.log('   ✅ Firestore rules deployed successfully!');
        return true;
      }
      const relErr = await releaseRes.json().catch(() => ({}));
      const relMsg = relErr.error?.message || JSON.stringify(relErr);
      console.log('   ⚠️  PATCH failed:', patchMsg.substring(0, 120));
      console.log('   ⚠️  POST release failed:', relMsg.substring(0, 120));
      return false;
    } else {
      const msg = rulesetData.error?.message || JSON.stringify(rulesetData);
      if (msg.includes('PERMISSION_DENIED') || msg.includes('not enabled')) {
        console.log('   ⚠️  Firebase Rules API not enabled.');
        console.log('   📋 Enable at: https://console.cloud.google.com/apis/api/firebaserules.googleapis.com/overview?project=' + PROJECT_ID);
        console.log('   Then run: firebase deploy --only firestore:rules\n');
      } else {
        console.log('   ⚠️  Could not deploy rules:', msg.substring(0, 100));
      }
      return false;
    }
  } catch (e) {
    console.log('   ⚠️  Could not deploy rules:', e.message);
    return false;
  }
}

async function main() {
  console.log(`\n🔧 Firebase Auto-Setup: ${PROJECT_ID}\n`);
  console.log(`   Service Account: ${SERVICE_ACCOUNT.client_email}\n`);

  try {
    const token = await getAccessToken();
    console.log('✅ Successfully authenticated!\n');

    // Enable Firestore API
    await enableService(token);

    // Check/create Firestore database
    const hasDb = await checkFirestore(token);
    if (!hasDb) {
      await createFirestoreDatabase(token, 'us-east1');
      const hasDb2 = await checkFirestore(token);
      if (!hasDb2) {
        await createFirestoreDatabase(token, 'asia-east1');
      }
    }

    // Enable Auth API
    await enableAuthAPI(token);

    // Check Auth config
    await checkAuthConfig(token);

    // Deploy Firestore rules
    await deployFirestoreRules(token);

    console.log('\n📋 Next Steps in Firebase Console:\n');
    console.log('   1️⃣  Authentication → Sign-in method:');
    console.log('      ✅ Enable "Google" provider\n');
    console.log('   2️⃣  Authentication → Settings → Authorized domains:');
    console.log('      ✅ suri-learning.vercel.app');
    console.log('      ✅ localhost\n');
    console.log('   3️⃣  Firestore → Database Rules:');
    console.log('      Copy rules from: firestore.rules file\n');
    console.log('   4️⃣  Vercel Dashboard → Settings → Environment Variables:');
    console.log('      Copy all from: .env.example\n');

    console.log('✅ Firebase Auto-Setup complete!\n');

  } catch (e) {
    console.error('\n❌ Setup failed:', e.message);
  }
}

main();
