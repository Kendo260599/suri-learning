/**
 * Unified Vocabulary Enrichment Script
 * 
 * Usage:
 *   npx tsx scripts/enrich-vocab.ts                    # Run all batches
 *   npx tsx scripts/enrich-vocab.ts --batch 0-1        # Run specific batch
 *   npx tsx scripts/enrich-vocab.ts --dry-run          # Preview without writing
 *   npx tsx scripts/enrich-vocab.ts --list             # List all batches
 */

import fs from 'fs';
import path from 'path';

const VOCAB_PATH = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

// Batch manifest - each batch processes specific word IDs
const BATCHES: Record<string, Array<{ id: string; synonyms: string[]; wordFamily: Record<string, string[]> }>> = {
  'band0-batch1': [
    { id: 'w_b0_1', synonyms: ['hi', 'greetings', 'hey', 'howdy'], wordFamily: { noun: ['hello'] } },
    { id: 'w_b0_2', synonyms: ['farewell', 'bye', 'see you', 'so long'], wordFamily: { noun: ['goodbye'] } },
    { id: 'w_b0_3', synonyms: ['yeah', 'yep', 'certainly', 'absolutely'], wordFamily: { noun: ['yes'] } },
    { id: 'w_b0_4', synonyms: ['nah', 'negative', 'not at all', 'never'], wordFamily: { noun: ['no'] } },
    { id: 'w_b0_5', synonyms: ['kindly', 'if you please'], wordFamily: { verb: ['please'], adj: ['pleased', 'pleasing'] } },
    { id: 'w_b0_6', synonyms: ['thanks', 'appreciation', 'gratitude'], wordFamily: { noun: ['thanks', 'thankfulness'], verb: ['thank'], adj: ['thankful'] } },
    { id: 'w_b0_7', synonyms: ['apologies', 'regretful', 'apologetic'], wordFamily: { noun: ['sorrow'], adj: ['sorry'] } },
    { id: 'w_b0_8', synonyms: ['guy', 'gentleman', 'male', 'boy'], wordFamily: { noun: ['man', 'manhood', 'mankind'], adj: ['manly'] } },
    { id: 'w_b0_9', synonyms: ['lady', 'female', 'girl'], wordFamily: { noun: ['woman', 'womanhood'], adj: ['womanly'] } },
    { id: 'w_b0_10', synonyms: ['volume', 'tome', 'publication', 'novel'], wordFamily: { noun: ['book', 'booking'], verb: ['book'] } },
  ],
  'band0-batch2': [
    { id: 'w_b0_11', synonyms: ['farewell', 'bye', 'see you', 'so long'], wordFamily: { noun: ['goodbye'] } },
    { id: 'w_b0_12', synonyms: ['kindly', 'if you please'], wordFamily: { verb: ['please'], adj: ['pleased', 'pleasing'] } },
    { id: 'w_b0_13', synonyms: ['take a seat', 'be seated', 'settle'], wordFamily: { noun: ['seat', 'sitting'], verb: ['sit', 'seat'] } },
    { id: 'w_b0_14', synonyms: ['leap', 'bound', 'spring', 'hop'], wordFamily: { noun: ['jump', 'jumper'], verb: ['jump'], adj: ['jumpy'] } },
    { id: 'w_b0_15', synonyms: ['home', 'residence', 'dwelling', 'abode'], wordFamily: { noun: ['house', 'housing'], verb: ['house'] } },
    { id: 'w_b0_16', synonyms: ['automobile', 'vehicle', 'motorcar', 'auto'], wordFamily: { noun: ['car'] } },
    { id: 'w_b0_17', synonyms: ['sapling', 'timber', 'wood'], wordFamily: { noun: ['tree'] } },
    { id: 'w_b0_18', synonyms: ['sunlight', 'sunshine', 'star'], wordFamily: { noun: ['sun', 'sunlight', 'sunshine'], adj: ['sunny'] } },
    { id: 'w_b0_19', synonyms: ['satellite', 'crescent'], wordFamily: { noun: ['moon', 'moonlight'] } },
    { id: 'w_b0_20', synonyms: ['feline', 'kitty', 'kitten'], wordFamily: { noun: ['cat', 'kitten'], adj: ['catty'] } },
  ],
};

// Load remaining batch data from JSON manifest (generated from old scripts)
const MANIFEST_PATH = path.join(process.cwd(), 'scripts/batch-manifest.json');
const USE_MANIFEST = fs.existsSync(MANIFEST_PATH);

interface EnrichmentData {
  synonyms: string[];
  wordFamily: Record<string, string[]>;
}

interface BatchManifest {
  batches: Record<string, Array<{ id: string } & EnrichmentData>>;
}

function loadManifest(): BatchManifest | null {
  if (!USE_MANIFEST) return null;
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    console.warn('⚠️ Failed to load manifest, using embedded data only');
    return null;
  }
}

function getAllBatches(): Record<string, Array<{ id: string } & EnrichmentData>> {
  if (USE_MANIFEST) {
    const manifest = loadManifest();
    if (manifest) return manifest.batches;
  }
  return BATCHES;
}

function enrichWord(content: string, id: string, data: EnrichmentData): string {
  // Check if word exists and doesn't already have synonyms
  if (!content.includes(`"id": "${id}"`)) {
    return content;
  }
  
  // Skip if already enriched
  const wordBlockMatch = content.match(new RegExp(`"id":\\s*"${id}"[\\s\\S]*?(?=,\\s*"id":|\\]\\s*\\})`));
  if (wordBlockMatch && wordBlockMatch[0].includes('"synonyms"')) {
    return content;
  }

  const synonymStr = JSON.stringify(data.synonyms);
  const wordFamilyStr = JSON.stringify(data.wordFamily);
  
  // Find the word and add enrichment after topicId
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
  const replacement = `$1,\n    "synonyms": ${synonymStr},\n    "wordFamily": ${wordFamilyStr}`;
  
  return content.replace(regex, replacement);
}

function runBatch(batchId: string, dryRun: boolean = false): number {
  const allBatches = getAllBatches();
  const batch = allBatches[batchId];
  
  if (!batch) {
    console.error(`❌ Batch not found: ${batchId}`);
    console.log('Available batches:', Object.keys(allBatches).join(', '));
    return 1;
  }

  console.log(`📦 Processing batch: ${batchId} (${batch.length} words)`);
  
  if (dryRun) {
    console.log('🔍 Dry run - no changes will be written');
    batch.forEach(({ id }) => console.log(`  - ${id}`));
    return 0;
  }

  let content = fs.readFileSync(VOCAB_PATH, 'utf8');
  let enrichedCount = 0;

  for (const { id, ...data } of batch) {
    const before = content;
    content = enrichWord(content, id, data as EnrichmentData);
    if (content !== before) {
      enrichedCount++;
    }
  }

  if (enrichedCount > 0) {
    fs.writeFileSync(VOCAB_PATH, content);
    console.log(`✅ Enriched ${enrichedCount}/${batch.length} words in ${batchId}`);
  } else {
    console.log(`⏭️  No words needed enrichment in ${batchId}`);
  }

  return 0;
}

function listBatches(): void {
  const allBatches = getAllBatches();
  console.log('📚 Available batches:\n');
  
  for (const [batchId, items] of Object.entries(allBatches)) {
    const firstId = items[0]?.id || 'unknown';
    const lastId = items[items.length - 1]?.id || 'unknown';
    console.log(`  ${batchId.padEnd(20)} ${firstId} → ${lastId} (${items.length} words)`);
  }
  
  console.log(`\nTotal: ${Object.keys(allBatches).length} batches`);
}

// CLI Argument parsing
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🎯 Unified Vocabulary Enrichment Script

Usage:
  npx tsx scripts/enrich-vocab.ts                    Run all batches
  npx tsx scripts/enrich-vocab.ts --batch band0-batch1  Run specific batch
  npx tsx scripts/enrich-vocab.ts --dry-run         Preview without writing
  npx tsx scripts/enrich-vocab.ts --list             List all batches
  npx tsx scripts/enrich-vocab.ts --help             Show this help

Examples:
  npx tsx scripts/enrich-vocab.ts --batch band0-batch1 --dry-run
  npx tsx scripts/enrich-vocab.ts --batch band0-batch1
  `);
  process.exit(0);
}

if (args.includes('--list')) {
  listBatches();
  process.exit(0);
}

const batchArg = args.find(arg => arg.startsWith('--batch='));
const dryRun = args.includes('--dry-run');

if (batchArg) {
  const batchId = batchArg.split('=')[1];
  process.exit(runBatch(batchId, dryRun));
}

// Run all batches
console.log('🚀 Starting vocabulary enrichment...\n');

const allBatches = getAllBatches();
let exitCode = 0;

for (const batchId of Object.keys(allBatches)) {
  const code = runBatch(batchId, dryRun);
  if (code !== 0) exitCode = code;
}

console.log('\n✨ Enrichment complete!');
process.exit(exitCode);
