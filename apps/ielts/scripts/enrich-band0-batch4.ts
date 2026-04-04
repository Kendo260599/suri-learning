import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_31": {
    "synonyms": ["ovum", "seed", "roe"],
    "wordFamily": { "noun": ["egg"] }
  },
  "w_b0_32": {
    "synonyms": ["sweetener", "sucrose"],
    "wordFamily": { "noun": ["sugar"], "verb": ["sugar"], "adj": ["sugary"] }
  },
  "w_b0_33": {
    "synonyms": ["sodium chloride", "seasoning"],
    "wordFamily": { "noun": ["salt"], "verb": ["salt"], "adj": ["salty"] }
  },
  "w_b0_34": {
    "synonyms": ["spice", "seasoning", "capsicum"],
    "wordFamily": { "noun": ["pepper"], "verb": ["pepper"], "adj": ["peppery"] }
  },
  "w_b0_35": {
    "synonyms": ["grease", "lubricant", "petroleum"],
    "wordFamily": { "noun": ["oil"], "verb": ["oil"], "adj": ["oily"] }
  },
  "w_b0_36": {
    "synonyms": ["spread", "fat", "margarine"],
    "wordFamily": { "noun": ["butter"], "verb": ["butter"], "adj": ["buttery"] }
  },
  "w_b0_37": {
    "synonyms": ["curd", "cheddar", "brie"],
    "wordFamily": { "noun": ["cheese"], "adj": ["cheesy"] }
  },
  "w_b0_38": {
    "synonyms": ["poultry", "fowl", "hen", "rooster"],
    "wordFamily": { "noun": ["chicken"] }
  },
  "w_b0_39": {
    "synonyms": ["meat", "cow", "cattle"],
    "wordFamily": { "noun": ["beef"], "adj": ["beefy"] }
  },
  "w_b0_40": {
    "synonyms": ["meat", "pig", "swine", "bacon"],
    "wordFamily": { "noun": ["pork"], "adj": ["porky"] }
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
console.log('Enriched w_b0_31 to w_b0_40');
