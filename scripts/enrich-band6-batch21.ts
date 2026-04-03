import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_201": {
    "synonyms": ["agreement", "deal", "pact", "settlement"],
    "wordFamily": { "noun": ["contract", "contractor"], "verb": ["contract"], "adj": ["contractual"], "adv": ["contractually"] }
  },
  "w_b6_202": {
    "synonyms": ["collaboration", "cooperation", "alliance", "association"],
    "wordFamily": { "noun": ["partnership", "partner"], "verb": ["partner"] }
  },
  "w_b6_203": {
    "synonyms": ["issue", "subject", "topic", "affair"],
    "wordFamily": { "noun": ["matter"], "verb": ["matter"] }
  },
  "w_b6_204": {
    "synonyms": ["problem", "difficulty", "issue", "distress"],
    "wordFamily": { "noun": ["trouble"], "verb": ["trouble"], "adj": ["troublesome"] }
  },
  "w_b6_205": {
    "synonyms": ["problem", "hardship", "challenge", "obstacle"],
    "wordFamily": { "noun": ["difficulty"], "adj": ["difficult"], "adv": ["difficultly"] }
  },
  "w_b6_206": {
    "synonyms": ["barrier", "hurdle", "impediment", "hindrance"],
    "wordFamily": { "noun": ["obstacle"] }
  },
  "w_b6_207": {
    "synonyms": ["obstacle", "hurdle", "blockade", "boundary"],
    "wordFamily": { "noun": ["barrier"] }
  },
  "w_b6_208": {
    "synonyms": ["obstacle", "barrier", "impediment", "difficulty"],
    "wordFamily": { "noun": ["hurdle"], "verb": ["hurdle"] }
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
console.log('Enriched w_b6_201 to w_b6_208');
