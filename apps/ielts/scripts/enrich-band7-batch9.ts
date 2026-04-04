import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_81": {
    "synonyms": ["associate", "link", "compare", "connect"],
    "wordFamily": { "noun": ["equation"], "verb": ["equate"] }
  },
  "w_b7_82": {
    "synonyms": ["epoch", "period", "age", "time"],
    "wordFamily": { "noun": ["era"] }
  },
  "w_b7_83": {
    "synonyms": ["eliminate", "destroy", "remove", "abolish"],
    "wordFamily": { "noun": ["eradication"], "verb": ["eradicate"] }
  },
  "w_b7_84": {
    "synonyms": ["moral", "principled", "righteous", "virtuous"],
    "wordFamily": { "noun": ["ethic", "ethics"], "adj": ["ethical"], "adv": ["ethically"] }
  },
  "w_b7_85": {
    "synonyms": ["cultural", "racial", "national", "traditional"],
    "wordFamily": { "noun": ["ethnicity"], "adj": ["ethnic"], "adv": ["ethnically"] }
  },
  "w_b7_86": {
    "synonyms": ["purpose", "role", "duty", "task"],
    "wordFamily": { "noun": ["function"], "verb": ["function"], "adj": ["functional"], "adv": ["functionally"] }
  },
  "w_b7_87": {
    "synonyms": ["finance", "capital", "money", "endowment"],
    "wordFamily": { "noun": ["fund", "funding"], "verb": ["fund"] }
  },
  "w_b7_88": {
    "synonyms": ["sex", "identity"],
    "wordFamily": { "noun": ["gender"] }
  },
  "w_b7_89": {
    "synonyms": ["create", "produce", "cause", "make"],
    "wordFamily": { "noun": ["generation", "generator"], "verb": ["generate"] }
  },
  "w_b7_90": {
    "synonyms": ["age group", "creation", "production", "formation"],
    "wordFamily": { "noun": ["generation"], "verb": ["generate"], "adj": ["generational"] }
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
console.log('Enriched w_b7_81 to w_b7_90');
