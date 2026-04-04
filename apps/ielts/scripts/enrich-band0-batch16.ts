import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_151": {
    "synonyms": ["northern", "northward"],
    "wordFamily": { "noun": ["north"], "adj": ["northern", "north"], "adv": ["north", "northwards"] }
  },
  "w_b0_152": {
    "synonyms": ["southern", "southward"],
    "wordFamily": { "noun": ["south"], "adj": ["southern", "south"], "adv": ["south", "southwards"] }
  },
  "w_b0_153": {
    "synonyms": ["eastern", "eastward"],
    "wordFamily": { "noun": ["east"], "adj": ["eastern", "east"], "adv": ["east", "eastwards"] }
  },
  "w_b0_154": {
    "synonyms": ["western", "westward"],
    "wordFamily": { "noun": ["west"], "adj": ["western", "west"], "adv": ["west", "westwards"] }
  },
  "w_b0_155": {
    "synonyms": ["way", "route", "course", "path"],
    "wordFamily": { "noun": ["direction", "director"], "verb": ["direct"], "adj": ["direct", "directional"], "adv": ["directly"] }
  },
  "w_b0_156": {
    "synonyms": ["method", "manner", "route", "path"],
    "wordFamily": { "noun": ["way"] }
  },
  "w_b0_157": {
    "synonyms": ["path", "way", "course", "direction"],
    "wordFamily": { "noun": ["route"], "verb": ["route"] }
  },
  "w_b0_158": {
    "synonyms": ["symbol", "mark", "indication", "signal"],
    "wordFamily": { "noun": ["sign", "signature"], "verb": ["sign"] }
  },
  "w_b0_159": {
    "synonyms": ["sign", "indication", "cue", "gesture"],
    "wordFamily": { "noun": ["signal"], "verb": ["signal"] }
  },
  "w_b0_160": {
    "synonyms": ["upward", "higher", "above"],
    "wordFamily": { "adv": ["up", "upwards"] }
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
console.log('Enriched w_b0_151 to w_b0_160');
