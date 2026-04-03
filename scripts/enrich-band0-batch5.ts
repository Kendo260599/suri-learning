import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_41": {
    "synonyms": ["spud", "tater", "tuber"],
    "wordFamily": { "noun": ["potato"] }
  },
  "w_b0_42": {
    "synonyms": ["love apple", "fruit"],
    "wordFamily": { "noun": ["tomato"] }
  },
  "w_b0_43": {
    "synonyms": ["bulb", "allium", "scallion"],
    "wordFamily": { "noun": ["onion"] }
  },
  "w_b0_44": {
    "synonyms": ["clove", "allium", "herb"],
    "wordFamily": { "noun": ["garlic"], "adj": ["garlicky"] }
  },
  "w_b0_45": {
    "synonyms": ["root vegetable"],
    "wordFamily": { "noun": ["carrot"] }
  },
  "w_b0_46": {
    "synonyms": ["greens", "head", "cole"],
    "wordFamily": { "noun": ["cabbage"] }
  },
  "w_b0_47": {
    "synonyms": ["cuke", "pickle", "gourd"],
    "wordFamily": { "noun": ["cucumber"] }
  },
  "w_b0_48": {
    "synonyms": ["citrus", "tangerine", "mandarin"],
    "wordFamily": { "noun": ["orange"] }
  },
  "w_b0_49": {
    "synonyms": ["vine fruit", "raisin", "berry"],
    "wordFamily": { "noun": ["grape"] }
  },
  "w_b0_50": {
    "synonyms": ["citrus", "lime", "citron"],
    "wordFamily": { "noun": ["lemon", "lemonade"], "adj": ["lemony"] }
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
console.log('Enriched w_b0_41 to w_b0_50');
