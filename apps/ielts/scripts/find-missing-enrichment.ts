import * as fs from 'fs';

const content = fs.readFileSync('src/data/roadmap_vocab.ts', 'utf-8');
const lines = content.split('\n');

let currentWord: any = null;
let missingCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('"word":')) {
    const wordMatch = line.match(/"word":\s*"(.*)"/);
    if (wordMatch) {
      currentWord = { word: wordMatch[1], line: i + 1 };
    }
  }
  if (line.startsWith('  },') && currentWord) {
    // Search backward from the end of the object to the word line
    let foundUsage = false;
    let foundRegister = false;
    for (let j = i - 1; j >= currentWord.line; j--) {
      if (lines[j].includes('"usageNotes":')) foundUsage = true;
      if (lines[j].includes('"register":')) foundRegister = true;
    }
    if (!foundUsage || !foundRegister) {
      console.log(`Missing data for: ${currentWord.word} at line ${currentWord.line}`);
      missingCount++;
    }
    currentWord = null;
  }
}

console.log(`Total missing: ${missingCount}`);
