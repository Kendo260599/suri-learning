import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_171": {
    "synonyms": ["section", "article", "provision", "condition"],
    "wordFamily": { "noun": ["clause"] }
  },
  "w_b6_172": {
    "synonyms": ["cipher", "key", "rules", "system"],
    "wordFamily": { "noun": ["code", "coding", "coder"], "verb": ["code", "encode", "decode"], "adj": ["coded"] }
  },
  "w_b6_173": {
    "synonyms": ["deal", "business", "exchange", "transfer"],
    "wordFamily": { "noun": ["transaction"], "verb": ["transact"], "adj": ["transactional"] }
  },
  "w_b6_174": {
    "synonyms": ["commerce", "business", "exchange", "swap"],
    "wordFamily": { "noun": ["trade", "trader"], "verb": ["trade"] }
  },
  "w_b6_175": {
    "synonyms": ["bring in", "buy from abroad", "meaning", "significance"],
    "wordFamily": { "noun": ["import", "importer", "importance"], "verb": ["import"], "adj": ["important"] }
  },
  "w_b6_176": {
    "synonyms": ["credit", "advance", "lend", "borrowing"],
    "wordFamily": { "noun": ["loan"], "verb": ["loan", "lend"] }
  },
  "w_b6_177": {
    "synonyms": ["levy", "duty", "tariff", "charge"],
    "wordFamily": { "noun": ["tax", "taxation"], "verb": ["tax"], "adj": ["taxable"] }
  },
  "w_b6_178": {
    "synonyms": ["affluence", "riches", "fortune", "prosperity"],
    "wordFamily": { "noun": ["wealth"], "adj": ["wealthy"] }
  },
  "w_b6_179": {
    "synonyms": ["financial", "monetary", "commercial", "profitable"],
    "wordFamily": { "noun": ["economy", "economics", "economist"], "verb": ["economize"], "adj": ["economic", "economical"], "adv": ["economically"] }
  },
  "w_b6_180": {
    "synonyms": ["financial expert", "analyst"],
    "wordFamily": { "noun": ["economist", "economy", "economics"], "verb": ["economize"], "adj": ["economic", "economical"] }
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
console.log('Enriched w_b6_171 to w_b6_180');
