/**
 * Firebase Admin Auto-Setup Script
 * Automatically checks and configures Firebase for the project
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '..', 'suri-learning-firebase-adminsdk-fbsvc-d7070ab1ac.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'suri-learning.firebasestorage.app',
});

const VERCEL_DOMAINS = [
  'suri-learning.vercel.app',
  'localhost',
];

async function setup() {
  const auth = admin.auth();
  const projectId = serviceAccount.project_id;

  console.log(`\n🔧 Firebase Auto-Setup: ${projectId}\n`);
  console.log(`   Service Account: ${serviceAccount.client_email}\n`);

  // 1. List users
  console.log('1️⃣  User Management...');
  try {
    const listUsers = await auth.listUsers(10);
    console.log(`   Total users: ${listUsers.users.length}`);
    if (listUsers.users.length === 0) {
      console.log('   (no users yet - will appear after first sign-in)');
    }
    listUsers.users.forEach((u) => {
      console.log(`   - ${u.email || 'N/A'} (uid: ${u.uid})`);
    });
  } catch (e) {
    console.error('   ❌ Could not list users:', e.message);
  }

  // 2. Check authorized domains (via config)
  console.log('\n2️⃣  Authorized Domains (add these in Firebase Console):');
  VERCEL_DOMAINS.forEach((d) => console.log(`   ✅ ${d}`));

  // 3. Check Firestore
  console.log('\n3️⃣  Firestore Database...');
  try {
    const firestore = admin.firestore();
    const collections = await firestore.listCollections();
    const colNames = collections.map((c) => c.id);
    console.log(colNames.length === 0
      ? '   ⚠️  No collections yet (will be created on first write)'
      : `   Collections: ${colNames.join(', ')}`);
  } catch (e) {
    console.error('   ❌ Firestore error:', e.message);
  }

  // 4. Output env vars
  console.log('\n4️⃣  Environment Variables for Vercel:\n');
  console.log('   Copy these → Vercel Dashboard → Settings → Environment Variables\n');
  console.log('   ── Production + Preview ──');
  console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDE4dPaA3nj5bncolxC9yFkftPNThbvSNg');
  console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=suri-learning.firebaseapp.com');
  console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=suri-learning');
  console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=suri-learning.firebasestorage.app');
  console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=880701007277');
  console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=1:880701007277:web:ec740a32869a96d0a56d24');
  console.log('   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LLXQVGHRB3');
  console.log('\n   ── Server-side (Build + Runtime) ──');
  console.log('   FIREBASE_ADMIN_PROJECT_ID=suri-learning');
  console.log('   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@suri-learning.iam.gserviceaccount.com');

  // 5. Summary
  console.log('\n📋 Manual Steps in Firebase Console:\n');
  console.log('   Authentication → Sign-in method:');
  console.log('      ✅ Enable "Google" provider');
  console.log('\n   Authentication → Settings → Authorized domains:');
  VERCEL_DOMAINS.forEach((d) => console.log(`      ✅ Add: ${d}`));

  console.log('\n   Firestore → Database Rules:');
  console.log('      (paste the rules from firestore.rules file in project root)\n');

  console.log('✅ Firebase Admin check complete!\n');
}

setup().catch(console.error);
