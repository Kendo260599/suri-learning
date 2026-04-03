import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_11": {
    "synonyms": ["farewell", "bye", "see you", "so long"],
    "wordFamily": { "noun": ["goodbye"] }
  },
  "w_b0_12": {
    "synonyms": ["kindly", "if you please"],
    "wordFamily": { "verb": ["please"], "adj": ["pleased", "pleasing"] }
  },
  "w_b0_13": {
    "synonyms": ["take a seat", "be seated", "settle"],
    "wordFamily": { "noun": ["seat", "sitting"], "verb": ["sit", "seat"] }
  },
  "w_b0_14": {
    "synonyms": ["leap", "bound", "spring", "hop"],
    "wordFamily": { "noun": ["jump", "jumper"], "verb": ["jump"], "adj": ["jumpy"] }
  },
  "w_b0_15": {
    "synonyms": ["home", "residence", "dwelling", "abode"],
    "wordFamily": { "noun": ["house", "housing"], "verb": ["house"] }
  },
  "w_b0_16": {
    "synonyms": ["automobile", "vehicle", "motorcar", "auto"],
    "wordFamily": { "noun": ["car"] }
  },
  "w_b0_17": {
    "synonyms": ["sapling", "timber", "wood"],
    "wordFamily": { "noun": ["tree"] }
  },
  "w_b0_18": {
    "synonyms": ["sunlight", "sunshine", "star"],
    "wordFamily": { "noun": ["sun", "sunlight", "sunshine"], "adj": ["sunny"] }
  },
  "w_b0_19": {
    "synonyms": ["satellite", "crescent"],
    "wordFamily": { "noun": ["moon", "moonlight"] }
  },
  "w_b0_20": {
    "synonyms": ["feline", "kitty", "kitten"],
    "wordFamily": { "noun": ["cat", "kitten"], "adj": ["catty"] }
  }
};

for (const [id, data] of Object.entries(enrichments)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
  const replacement = `$1,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
  
  if (content.includes(`"id": "${id}"`) && !content.includes(`"id": "${id}"` + '[\\s\\S]*?"synonyms":')) {
      content = content.replace(regex, replacement);
  }
}

fs.writeFileSync(vocabPath, content);
console.log('Enriched w_b0_11 to w_b0_20');
