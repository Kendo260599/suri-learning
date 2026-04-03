// Script to split vocabulary by band level
// Run: npx tsx scripts/splitVocab.ts

import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const roadmapVocabPath = './src/data/roadmap_vocab.ts';
const bandsDir = './src/data/bands';

// Read the file
const content = readFileSync(roadmapVocabPath, 'utf-8');

// Extract the array content between [ and ];
const startMarker = 'export const CAMBRIDGE_ROADMAP: Word[] = [';
const startIdx = content.indexOf(startMarker);
const endIdx = content.lastIndexOf('];');

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find array bounds');
  process.exit(1);
}

const arrayContent = content.substring(startIdx + startMarker.length, endIdx);

// Parse words (simple JSON-like parsing)
const wordsByBand: Record<number, string[]> = {
  0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
};

let currentWord = '';
let braceCount = 0;
let inWord = false;
let currentBand = -1;

for (let i = 0; i < arrayContent.length; i++) {
  const char = arrayContent[i];

  if (char === '{') {
    if (!inWord) {
      inWord = true;
      braceCount = 0;
    }
    braceCount++;
    currentWord += char;
  } else if (char === '}') {
    braceCount--;
    currentWord += char;
    if (braceCount === 0 && inWord) {
      inWord = false;
      // Extract band from word
      const bandMatch = currentWord.match(/"band":\s*(\d+)/);
      if (bandMatch) {
        const band = parseInt(bandMatch[1]);
        if (band >= 0 && band <= 7) {
          wordsByBand[band].push(currentWord.trim());
        }
      }
      currentWord = '';
    }
  } else if (inWord) {
    currentWord += char;
  }
}

// Output summary
console.log('Words by band:');
Object.entries(wordsByBand).forEach(([band, words]) => {
  console.log(`  Band ${band}: ${words.length} words`);
});

// Create files for each band
mkdirSync(bandsDir, { recursive: true });

Object.entries(wordsByBand).forEach(([band, words]) => {
  const fileContent = `import { Word } from "../../types";

// Band ${band} vocabulary (${words.length} words)
// Auto-generated from roadmap_vocab.ts

export const BAND_${band}_WORDS: Word[] = [
${words.join(',\n')}
];
`;

  const filename = `${bandsDir}/band${band}.ts`;
  writeFileSync(filename, fileContent);
  console.log(`Created: ${filename}`);
});

console.log('\nDone! Created band-split vocabulary files.');
