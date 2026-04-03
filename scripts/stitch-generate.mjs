/**
 * Stitch MCP Client — Fixed version with correct project ID parsing
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STITCH_API_KEY = process.env.STITCH_API_KEY;
const BASE_URL = 'https://stitch.googleapis.com/mcp';
const SCREEN_DIR = join(__dirname, '..', 'design', 'screens-stitch');
const LOG_FILE = join(__dirname, '..', 'design', 'generation-log.json');

mkdirSync(SCREEN_DIR, { recursive: true });

const SCREENS = [
  {
    name: 'home-dashboard',
    prompt: `A mobile app home screen for an English learning gamification app (IELTS focus) called Suri Learning. Top bar: left=5 red heart icons for lives, center=XP progress bar showing "250 / 500 XP" in green, right=streak flame icon with "3" days count. Below: daily goal card "Learn 5 words today" with progress 3/5. Three lesson cards in a vertical list: first card has green checkmark and says "Basics - Completed ✓", second card has orange flame and says "Food & Drink - In Progress", third card has a lock icon and is grayed out saying "Travel - Locked". Bottom: bottom navigation with icons: Home (active/highlighted orange), Learn, AI Chat (purple glow), Leaderboard, Profile. Brand color orange #ea580c. Clean, gamified design like Duolingo. Background light gray #f7f7f7. Font Inter. Mobile-first 375px width. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'Home Dashboard',
  },
  {
    name: 'vocabulary-flashcard',
    prompt: `A mobile flashcard practice screen for an English learning app. Large centered flashcard (white card with shadow) showing word "UBIQUITOUS" in large bold text, phonetic /juːˈbɪkwɪtəs/ below, part of speech (adjective). Below the card: three tabs "English | Vietnamese | Example". Card has a flip animation icon at bottom. Progress indicator: "Card 5 of 20". Bottom: 4 answer buttons (A/B/C/D) for multiple choice meaning. When answered, show green checkmark for correct, red X for wrong. Background light gray #f7f7f7. Brand accent orange #ea580c. Clean mobile UI. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'Vocabulary Flashcard',
  },
  {
    name: 'quiz-mode',
    prompt: `A mobile quiz screen for an IELTS English learning app. Top: countdown timer showing "00:24" in red circle, progress bar "Question 3/10" below timer. Center: question card asking "What is the meaning of Ephemeral?" with 4 multiple choice answer buttons A) Brief B) Permanent C) Ancient D) Loud. Correct answer is B. When answered wrong, red shake animation. When correct, green bounce animation with "+10 XP" popup. Bottom: skip button and hint button (uses 10 gems). Dark top bar, white question card, brand orange buttons. Gamified Duolingo-style feedback. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'Quiz Mode',
  },
  {
    name: 'ai-chat',
    prompt: `A mobile AI chat screen for practicing English speaking and writing. Chat bubbles: user on right (green bubble #58cc02, white text), AI assistant on left (purple gradient bubble #a560f2 to #7c3aed, white text, robot avatar). AI says "Hello! Let's practice IELTS Speaking Part 2. Describe a memorable trip you took." Input bar at bottom with attachment icon, text field, red microphone button, purple send button. Top: back arrow, AI Speaking title, gem balance 156. Segmented control "Speaking | Writing | Vocabulary". ChatGPT-style modern UI. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'AI Chat',
  },
  {
    name: 'leaderboard',
    prompt: `A mobile leaderboard screen for an English learning app. Top: segmented control "Weekly | Monthly | All Time" (Weekly active). Top 3 podium: center gold trophy "2nd @thanh_dev 2400 XP", left silver "3rd @lan_ielts 2100 XP", right bronze "1st @minh_learns 2800 XP". Below: ranked list with avatar, username, XP, rank badge. Current user row highlighted with orange border and "Bạn" badge. Stats: Your Rank #15, XP 1,560, Lessons 28. Banner "Cần thêm 440 XP để vào Top 10!" with orange CTA. Clean competitive design. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'Leaderboard',
  },
  {
    name: 'profile',
    prompt: `A mobile profile screen for an English learning app. Header: large circular avatar (gradient orange #ea580c), username "@suri_learner", level badge "Level 12 - Advanced". Stats row: Streak 14 days 🔥, Total XP 4,250 ⭐, Words 387 📚, Gems 156 💎. XP progress bar "Level 12 → 13" 425/500 XP. Achievement badges: 3 unlocked (7-day streak, 100 words, Quiz Master) gold bordered, 2 locked gray. Learning stats: 42 giờ học, 42 bài, 28 quiz, 78% accuracy. Invite friends +50💎 card. Settings gear icon. Clean card-based layout. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'Profile',
  },
  {
    name: 'settings',
    prompt: `A mobile settings screen for an English learning app. iOS-style grouped table. Section "Tài khoản": Account (person icon), Upgrade Premium. Section "Học tập": Daily Goal 5 words/day, Reminders 19:00, Target Language English IELTS. Section "Ứng dụng": Sound Effects toggle ON green, Dark Mode toggle OFF gray, Notifications. Section "Hỗ trợ": Help FAQ, Rate App, Privacy Policy, Terms of Service, Contact Support. Each item has chevron right except toggles. Version v1.0.0 at bottom. Orange brand accent. Clean minimal white design. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'Settings',
  },
  {
    name: 'lesson-complete',
    prompt: `A mobile lesson complete celebration screen for an English learning app. Confetti animation at top. Large green checkmark circle in center. "Xuất sắc!" heading in bold. Stats: +25 XP green, +3 words learned, Streak +1 🔥. XP progress bar 425→450 XP toward Level 13. "What's Next": recommended Vocabulary Quiz card orange border "Đề xuất" badge, New Words Review card, AI Conversation card. Continue Quiz button green #58cc02. Share Tweet/WhatsApp/Google+. Light gray background. Celebratory bounce animations. Export as React + Tailwind CSS.`,
    deviceType: 'MOBILE',
    description: 'Lesson Complete',
  },
];

// ── MCP Helpers ────────────────────────────────────────────────────────────────

function extractProjectId(result) {
  if (!result) return null;
  // structuredContent.name = "projects/123456789"
  if (result.structuredContent?.name) {
    return result.structuredContent.name.replace('projects/', '');
  }
  // Try content[0].text JSON parse
  if (result.content?.[0]?.type === 'text') {
    try {
      const parsed = JSON.parse(result.content[0].text);
      if (parsed.name) return parsed.name.replace('projects/', '');
      if (parsed.projectId) return parsed.projectId;
    } catch (_) {}
  }
  // Fallback
  if (result.name) return result.name.replace('projects/', '');
  if (result.projectId) return result.projectId;
  return null;
}

function extractScreenId(result) {
  if (!result) return null;
  if (result.structuredContent?.screenId) return result.structuredContent.screenId;
  if (result.screenId) return result.screenId;
  if (result.id) return result.id;
  if (result.content?.[0]?.type === 'text') {
    try {
      const parsed = JSON.parse(result.content[0].text);
      return parsed.screenId || parsed.id || parsed.name?.replace('screens/', '');
    } catch (_) {}
  }
  return null;
}

function extractHtml(result) {
  if (!result) return null;
  if (result.structuredContent?.html) return result.structuredContent.html;
  if (result.html) return result.html;
  if (result.content?.[0]?.type === 'text') {
    const text = result.content[0].text;
    if (text.startsWith('<') || text.startsWith('<!DOCTYPE')) return text;
    try {
      const parsed = JSON.parse(text);
      return parsed.html || parsed.htmlUrl || null;
    } catch (_) {}
  }
  return null;
}

async function main() {
  if (!STITCH_API_KEY) {
    console.error('❌ STITCH_API_KEY not set');
    process.exit(1);
  }

  console.log('🔑 Stitch API Key:', STITCH_API_KEY.substring(0, 12) + '...\n');

  // ── Connect to MCP ──────────────────────────────────────────────────────────
  const transport = new StreamableHTTPClientTransport(new URL(BASE_URL), {
    requestInit: {
      headers: { 'X-Goog-Api-Key': STITCH_API_KEY },
    },
  });

  const client = new Client(
    { name: 'stitch-cli', version: '1.0.0' },
    { capabilities: {} },
  );

  await client.connect(transport);
  console.log('✅ Connected to Stitch MCP\n');

  // ── Create Project ──────────────────────────────────────────────────────────
  console.log('🏗️  Creating project...');
  let projectResult;
  try {
    projectResult = await client.callTool(
      { name: 'create_project', arguments: { title: 'Suri Learning App' } },
      undefined,
      { timeout: 60000 },
    );
  } catch (e) {
    console.error('❌ create_project failed:', e.message);
    process.exit(1);
  }

  const projectId = extractProjectId(projectResult);
  const projectFullId = projectResult?.structuredContent?.name || '';

  console.log(`✅ Project ID: ${projectId}`);
  console.log(`   Full ID: ${projectFullId}\n`);

  // ── Generate All Screens ─────────────────────────────────────────────────────
  console.log(`🎨 Generating ${SCREENS.length} screens...\n`);
  const log = { projectId, projectFullId, generatedAt: new Date().toISOString(), screens: [] };

  for (let i = 0; i < SCREENS.length; i++) {
    const screen = SCREENS[i];
    process.stdout.write(`  [${i + 1}/${SCREENS.length}] ${screen.description}... `);

    let screenId = null;
    let htmlContent = null;
    let error = null;
    let generationMs = 0;

    // Try bare numeric ID first, then full "projects/ID" format
    const projectIdsToTry = [projectId, projectFullId];

    for (const pid of projectIdsToTry) {
      if (htmlContent) break;

      try {
        const start = Date.now();
        const genResult = await client.callTool(
          {
            name: 'generate_screen_from_text',
            arguments: { projectId: pid, prompt: screen.prompt, deviceType: screen.deviceType },
          },
          undefined,
          { timeout: 300000 },
        );
        generationMs = Date.now() - start;

        screenId = extractScreenId(genResult);
        htmlContent = extractHtml(genResult);

        // If no HTML, try to get screen details
        if (!htmlContent && screenId) {
          try {
            const screenResult = await client.callTool(
              { name: 'get_screen', arguments: { screenId, projectId: pid } },
              undefined,
              { timeout: 60000 },
            );
            htmlContent = extractHtml(screenResult);
            if (!screenId) screenId = extractScreenId(screenResult);
          } catch (_) {}
        }

        // Check for error in result
        if (genResult?.isError || genResult?.content?.[0]?.text?.includes('not found')) {
          error = genResult?.content?.[0]?.text || 'Generation failed';
          htmlContent = null;
        }

        console.log(`✅ (${(generationMs / 1000).toFixed(1)}s)`);
        if (screenId) console.log(`     🆔 Screen: ${screenId}`);

      } catch (e) {
        if (pid === projectIdsToTry[projectIdsToTry.length - 1]) {
          error = e.message;
          console.log(`❌ ${e.message.substring(0, 80)}`);
        }
      }
    }

    // Save result
    const filename = `${screen.name}-stitch.html`;
    const filepath = join(SCREEN_DIR, filename);

    if (htmlContent && htmlContent.length > 200) {
      writeFileSync(filepath, htmlContent);
      console.log(`     📁 Saved: ${filename} (${(htmlContent.length / 1024).toFixed(1)} KB)`);
    } else {
      const rawContent = `<!-- Stitch Generation: ${screen.description} -->
<!-- Screen ID: ${screenId || 'N/A'} -->
<!-- Project ID: ${projectId} -->
<!-- Generated: ${new Date().toISOString()} -->
<!-- Generation time: ${generationMs}ms -->
<!-- Error: ${error || 'none'} -->
<!-- Result: ${JSON.stringify({ screenId, hasHtml: !!htmlContent, htmlLength: htmlContent?.length || 0 })} -->`;
      writeFileSync(filepath, rawContent);
      console.log(`     📁 Saved placeholder (${(rawContent.length / 1024).toFixed(1)} KB)`);
    }

    log.screens.push({
      name: screen.name,
      description: screen.description,
      screenId,
      projectId,
      hasHtml: !!(htmlContent && htmlContent.length > 200),
      htmlLength: htmlContent?.length || 0,
      generationMs,
      error,
    });

    if (i < SCREENS.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Save log
  writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));

  // Summary
  const successCount = log.screens.filter(s => s.hasHtml).length;
  console.log(`\n📊 Summary: ${successCount}/${SCREENS.length} screens generated with HTML`);
  console.log(`📁 Output: ${SCREEN_DIR}`);
  console.log(`📋 Log: ${LOG_FILE}`);

  await client.close();
  console.log('\n✅ Done!');
}

main().catch(e => {
  console.error('\n❌ Fatal:', e.message);
  process.exit(1);
});
