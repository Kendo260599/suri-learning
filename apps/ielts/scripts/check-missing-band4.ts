import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
const content = fs.readFileSync(vocabPath, 'utf8');

const regex = /\{[\s\S]*?"id":\s*"(w_b6_\d+)"[\s\S]*?"band":\s*6[\s\S]*?\}/g;
let match;
const missingSynonyms = [];
const missingWordFamily = [];

while ((match = regex.exec(content)) !== null) {
  const block = match[0];
  const id = match[1];
  if (!block.includes('"synonyms":')) {
    missingSynonyms.push(id);
  }
  if (!block.includes('"wordFamily":')) {
    missingWordFamily.push(id);
  }
}

console.log('Missing Band 6 Synonyms:', missingSynonyms);
console.log('Missing Band 6 WordFamily:', missingWordFamily);
