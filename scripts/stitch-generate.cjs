#!/usr/bin/env node
/**
 * Stitch MCP Direct Client
 * Calls Google Stitch MCP API directly via HTTP/JSON-RPC
 * No SDK build required — works with raw API key
 */

const STITCH_API_KEY = process.env.STITCH_API_KEY;
const STITCH_BASE_URL = 'https://stitch.googleapis.com';

if (!STITCH_API_KEY) {
  console.error('❌ Missing STITCH_API_KEY');
  process.exit(1);
}

// ─── MCP JSON-RPC Helpers ─────────────────────────────────────────────────────

async function mcpCall(method, params = {}) {
  const response = await fetch(`${STITCH_BASE_URL}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STITCH_API_KEY}`,
      'x-goog-api-key': STITCH_API_KEY,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MCP ${response.status}: ${text}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`MCP Error ${data.error.code}: ${data.error.message}`);
  }
  return data.result;
}

// ─── Screen Generation Prompts ─────────────────────────────────────────────────

const SCREENS = [
  {
    name: 'home-dashboard',
    prompt: `A mobile app home screen for an English learning gamification app (IELTS focus) called Suri Learning. Top bar: left=5 red heart icons for lives, center=XP progress bar showing "250 / 500 XP" in green, right=streak flame icon with "3" days count. Below: daily goal card "Learn 5 words today" with progress 3/5. Three lesson cards in a vertical list: first card has green checkmark and says "Basics - Completed", second card has orange flame and says "Food & Drink - In Progress", third card has a lock icon and is grayed out saying "Travel - Locked". Bottom: bottom navigation with icons: Home (active/highlighted), Learn, AI Chat (purple glow), Leaderboard, Profile. Brand color orange #ea580c. Clean, gamified design like Duolingo. Background light gray #f7f7f7. Font Inter. Mobile-first 375px width.`,
    deviceType: 'MOBILE',
    description: 'Home Dashboard',
  },
  {
    name: 'vocabulary-flashcard',
    prompt: `A mobile flashcard practice screen for an English learning app. Large centered flashcard (white card with shadow) showing word "UBIQUITOUS" in large bold text, phonetic /juːˈbɪkwɪtəs/ below, part of speech (adjective). Below the card: three example sentences in tabs (English, Vietnamese, Example). Card has a flip animation icon at bottom. Progress indicator: "Card 5 of 20". Bottom: 4 answer buttons (A/B/C/D) for multiple choice meaning. When answered, show green checkmark for correct, red X for wrong. Background light gray #f7f7f7. Brand accent orange #ea580c. Clean mobile UI.`,
    deviceType: 'MOBILE',
    description: 'Vocabulary Flashcard',
  },
  {
    name: 'quiz-mode',
    prompt: `A mobile quiz screen for an IELTS English learning app. Top: countdown timer showing "00:24" in red circle, progress bar "Question 3/10" below timer. Three dots showing answered/wrong/current. Center: question card asking "What is the meaning of Ephemeral?" with 4 multiple choice answer buttons A) Brief B) Permanent C) Ancient D) Loud. Correct answer is B. When answered wrong, red shake animation. When correct, green bounce animation. Bottom: skip button and hint button (uses 10 gems). Dark top bar, white question card, brand orange buttons. Gamified Duolingo-style feedback with popup showing "Correct! +10 XP" or "Wrong! -1 ❤️".`,
    deviceType: 'MOBILE',
    description: 'Quiz Mode',
  },
  {
    name: 'ai-chat',
    prompt: `A mobile AI chat screen for practicing English speaking and writing. Chat bubbles: user on right (green bubble #58cc02, white text), AI assistant on left (purple gradient bubble #a560f2 to #7c3aed, white text, robot avatar). AI says "Hello! Let's practice IELTS Speaking Part 2. Describe a memorable trip you took." with topic label. User bubble shows "Yes, I really enjoy learning new languages..." Input bar at bottom with paperclip attachment icon, text field "Nhập tin nhắn...", red microphone button, purple send button. Top: back arrow, AI Speaking title, purple gem balance showing 156. Segmented control "Speaking | Writing | Vocabulary". Modern chat UI like ChatGPT.`,
    deviceType: 'MOBILE',
    description: 'AI Chat',
  },
  {
    name: 'leaderboard',
    prompt: `A mobile leaderboard screen for an English learning app. Top: segmented control "Weekly | Monthly | All Time" (Weekly active). Top 3 podium: center gold trophy "2nd - @thanh_dev - 2400 XP", left silver "3rd - @lan_ielts - 2100 XP", right bronze "1st - @minh_learns - 2800 XP". User avatar circles with rank badges. Below: scrollable ranked list with avatar circle, username, XP count, rank badge. Current user row highlighted with orange border and "Bạn" badge. Stats cards at bottom: Your Rank #15, Your XP 1,560, Lessons 28. Bottom banner: "Cần thêm 440 XP để vào Top 10!" with orange CTA button "Học ngay". Clean, competitive design.`,
    deviceType: 'MOBILE',
    description: 'Leaderboard',
  },
  {
    name: 'profile',
    prompt: `A mobile profile screen for an English learning app. Header: large circular avatar (gradient orange #ea580c to #ff9600) with level 12 badge, username "@suri_learner", level badge "Level 12 - Advanced". Edit profile button. Stats row: Streak 14 days flame icon, Total XP 4,250 star icon, Words 387 book icon, Gems 156 diamond icon. XP progress bar "Level 12 → 13" showing 425/500 XP. Achievement badges section: 3 unlocked badges (7-day streak, 100 words learned, Quiz Master) with gold borders, 2 locked badges grayed out with lock. Learning stats card: 42 giờ học, 42 bài hoàn thành, 28 quiz, 78% accuracy, 15 AI conversations. Invite friends card with 50 diamond reward. Settings gear icon top right. Clean card-based layout.`,
    deviceType: 'MOBILE',
    description: 'Profile',
  },
  {
    name: 'settings',
    prompt: `A mobile settings screen for an English learning app. iOS-style grouped table layout. Section "Tài khoản": Account (person icon), Upgrade Premium (purple gem). Section "Học tập": Daily Goal 5 words/day, Reminders 19:00 daily, Target Language English IELTS. Section "Ứng dụng": Sound Effects toggle ON (green), Dark Mode toggle OFF (gray), Notifications. Section "Hỗ trợ": Help FAQ, Rate App star, Privacy Policy shield, Terms of Service, Contact Support. Each item has chevron right arrow except toggles. Version number at bottom "v1.0.0". Orange brand accent on active toggles. White background. Clean and minimal.`,
    deviceType: 'MOBILE',
    description: 'Settings',
  },
  {
    name: 'lesson-complete',
    prompt: `A mobile lesson complete celebration screen for an English learning app. Confetti animation at top. Large green checkmark circle in center. "Xuất sắc!" heading in bold. Stats card: +25 XP (green), +3 words learned, Streak +1 flame. XP progress bar showing before/after (425→450 XP) toward Level 13. "What's Next" section: recommended Vocabulary Quiz card (orange border, "Đề xuất" badge), New Words Review card, AI Conversation card. Continue Quiz button in green #58cc02. Share buttons: Tweet, WhatsApp, Google+. Background light gray. Celebratory, gamified design with bounce animations.`,
    deviceType: 'MOBILE',
    description: 'Lesson Complete',
  },
];

// ─── Main Flow ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔑 Stitch API Key:', STITCH_API_KEY.substring(0, 8) + '...');

  // Step 1: List available tools
  console.log('\n📡 Connecting to Stitch MCP...');
  try {
    const toolsResult = await mcpCall('tools/list');
    const toolNames = toolsResult.tools?.map(t => t.name) || [];
    console.log('✅ Available tools:', toolNames.join(', '));
  } catch (e) {
    console.log('⚠️  tools/list not available, trying direct approach');
  }

  // Step 2: Create or find project
  let projectId;
  try {
    const createResult = await mcpCall('create_project', { title: 'Suri Learning App' });
    projectId = createResult?.projectId || createResult?.id;
    console.log('✅ Project created:', projectId);
  } catch (e) {
    console.log('⚠️  create_project error:', e.message);
    // Try list_projects to find existing
    try {
      const projects = await mcpCall('list_projects');
      if (projects?.projects?.length > 0) {
        projectId = projects.projects[0].projectId;
        console.log('📁 Using existing project:', projectId);
      }
    } catch (e2) {
      console.log('⚠️  list_projects error:', e2.message);
    }
  }

  if (!projectId) {
    console.log('\n🔄 Trying generate_screen_from_text directly...');
    return await generateAllScreensDirect();
  }

  // Step 3: Generate all screens
  console.log(`\n🎨 Generating ${SCREENS.length} screens...\n`);
  const results = [];

  for (let i = 0; i < SCREENS.length; i++) {
    const screen = SCREENS[i];
    process.stdout.write(`  [${i + 1}/${SCREENS.length}] ${screen.description}... `);

    try {
      const result = await mcpCall('generate_screen_from_text', {
        projectId,
        prompt: screen.prompt,
        deviceType: screen.deviceType,
      });

      console.log('✅');
      results.push({
        name: screen.name,
        description: screen.description,
        result,
      });

      // Save screen ID for later
      const screenId = result?.screenId || result?.id;
      if (screenId) {
        console.log(`     Screen ID: ${screenId}`);
      }
    } catch (e) {
      console.log('❌');
      console.log(`     Error: ${e.message}`);
      results.push({
        name: screen.name,
        description: screen.description,
        error: e.message,
      });
    }

    // Rate limiting - wait between calls
    if (i < SCREENS.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Summary
  console.log('\n📊 Generation Summary:');
  results.forEach((r, i) => {
    const status = r.error ? '❌' : '✅';
    console.log(`  ${status} ${i + 1}. ${r.description}${r.error ? ` — ${r.error}` : ''}`);
  });

  return results;
}

async function generateAllScreensDirect() {
  console.log('\n🎨 Trying direct screen generation...');
  const results = [];

  for (let i = 0; i < SCREENS.length; i++) {
    const screen = SCREENS[i];
    process.stdout.write(`  [${i + 1}/${SCREENS.length}] ${screen.description}... `);

    try {
      // Try different method names
      const methods = [
        { name: 'generate_screen', params: { prompt: screen.prompt, deviceType: screen.deviceType } },
        { name: 'generate', params: { prompt: screen.prompt, deviceType: screen.deviceType } },
      ];

      let result = null;
      for (const m of methods) {
        try {
          result = await mcpCall(m.name, m.params);
          break;
        } catch (e) {
          // Try next method
        }
      }

      if (result) {
        console.log('✅');
        results.push({ name: screen.name, description: screen.description, result });
      } else {
        console.log('⚠️  No method worked');
        results.push({ name: screen.name, description: screen.description, error: 'No method available' });
      }
    } catch (e) {
      console.log(`❌ ${e.message}`);
      results.push({ name: screen.name, description: screen.description, error: e.message });
    }

    if (i < SCREENS.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  return results;
}

main().then(() => {
  console.log('\n✅ Done!');
  process.exit(0);
}).catch(e => {
  console.error('\n❌ Fatal:', e.message);
  process.exit(1);
});
