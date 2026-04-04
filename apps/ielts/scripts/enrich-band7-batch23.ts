import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_221": {
    "synonyms": ["gather", "assemble", "collect", "convene"],
    "wordFamily": { "noun": ["congregation"], "verb": ["congregate"] }
  },
  "w_b7_222": {
    "synonyms": ["gathering", "assembly", "flock", "crowd"],
    "wordFamily": { "noun": ["congregation"], "verb": ["congregate"] }
  },
  "w_b7_223": {
    "synonyms": ["parliament", "assembly", "council", "legislature"],
    "wordFamily": { "noun": ["congress"], "adj": ["congressional"] }
  },
  "w_b7_224": {
    "synonyms": ["speculative", "theoretical", "hypothetical", "supposed"],
    "wordFamily": { "noun": ["conjecture"], "verb": ["conjecture"], "adj": ["conjectural"] }
  },
  "w_b7_225": {
    "synonyms": ["guess", "speculation", "surmise", "assumption"],
    "wordFamily": { "noun": ["conjecture"], "verb": ["conjecture"], "adj": ["conjectural"] }
  },
  "w_b7_226": {
    "synonyms": ["marital", "matrimonial", "nuptial", "connubial"],
    "wordFamily": { "adj": ["conjugal"] }
  },
  "w_b7_227": {
    "synonyms": ["combination", "union", "joining", "meeting"],
    "wordFamily": { "noun": ["conjunction"] }
  },
  "w_b7_228": {
    "synonyms": ["summon", "evoke", "produce", "magic"],
    "wordFamily": { "noun": ["conjurer", "conjuring"], "verb": ["conjure"] }
  },
  "w_b7_229": {
    "synonyms": ["link", "join", "attach", "unite"],
    "wordFamily": { "noun": ["connection"], "verb": ["connect"], "adj": ["connected"] }
  },
  "w_b7_230": {
    "synonyms": ["conspire", "collude", "plot", "scheme"],
    "wordFamily": { "noun": ["connivance"], "verb": ["connive"] }
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
console.log('Enriched w_b7_221 to w_b7_230');
