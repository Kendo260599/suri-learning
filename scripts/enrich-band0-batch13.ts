import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_121": {
    "synonyms": ["ring", "loop", "round", "sphere"],
    "wordFamily": { "noun": ["circle"], "verb": ["circle"], "adj": ["circular"] }
  },
  "w_b0_122": {
    "synonyms": ["trigon", "delta"],
    "wordFamily": { "noun": ["triangle"], "adj": ["triangular"] }
  },
  "w_b0_123": {
    "synonyms": ["flame", "blaze", "inferno", "heat"],
    "wordFamily": { "noun": ["fire"], "verb": ["fire"], "adj": ["fiery"] }
  },
  "w_b0_124": {
    "synonyms": ["frost", "glacier", "cube"],
    "wordFamily": { "noun": ["ice", "icicle"], "verb": ["ice"], "adj": ["icy"] }
  },
  "w_b0_125": {
    "synonyms": ["this day", "now", "presently"],
    "wordFamily": { "noun": ["today"], "adv": ["today"] }
  },
  "w_b0_126": {
    "synonyms": ["the next day", "the morrow"],
    "wordFamily": { "noun": ["tomorrow"], "adv": ["tomorrow"] }
  },
  "w_b0_127": {
    "synonyms": ["the day before", "the previous day"],
    "wordFamily": { "noun": ["yesterday"], "adv": ["yesterday"] }
  },
  "w_b0_128": {
    "synonyms": ["seven days", "sennight"],
    "wordFamily": { "noun": ["week", "weekend"], "adj": ["weekly"], "adv": ["weekly"] }
  },
  "w_b0_129": {
    "synonyms": ["four weeks", "thirty days"],
    "wordFamily": { "noun": ["month"], "adj": ["monthly"], "adv": ["monthly"] }
  },
  "w_b0_130": {
    "synonyms": ["twelve months", "annum"],
    "wordFamily": { "noun": ["year"], "adj": ["yearly"], "adv": ["yearly"] }
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
console.log('Enriched w_b0_121 to w_b0_130');
