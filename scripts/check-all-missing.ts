import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
const content = fs.readFileSync(vocabPath, 'utf8');

// The file exports an array: export const roadmapVocab: Word[] = [ ... ];
// We can extract the array part and parse it.
const arrayStart = content.indexOf('[');
const arrayEnd = content.lastIndexOf(']');
const arrayContent = content.substring(arrayStart, arrayEnd + 1);

let vocab = [];
try {
  // Use eval or Function to parse since it's a TS file with unquoted keys or trailing commas
  vocab = new Function(`return ${arrayContent}`)();
} catch (e) {
  console.error("Failed to parse vocab array:", e);
  process.exit(1);
}

const missing = [];

for (const word of vocab) {
  if (!word.synonyms || !word.wordFamily) {
    missing.push({ id: word.id, band: word.band });
  }
}

console.log('Missing Enrichment (Synonyms or WordFamily):');
console.table(missing);
console.log('Total missing:', missing.length);


