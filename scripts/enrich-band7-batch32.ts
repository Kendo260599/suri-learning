import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_311": {
    "synonyms": ["manage", "survive", "handle", "deal with"],
    "wordFamily": { "verb": ["cope"] }
  },
  "w_b7_312": {
    "synonyms": ["center", "heart", "nucleus", "essence"],
    "wordFamily": { "noun": ["core"], "adj": ["core"] }
  },
  "w_b7_313": {
    "synonyms": ["business", "company", "commercial", "enterprise"],
    "wordFamily": { "noun": ["corporation"], "adj": ["corporate"] }
  },
  "w_b7_314": {
    "synonyms": ["match", "agree", "correlate", "communicate"],
    "wordFamily": { "noun": ["correspondence", "correspondent"], "verb": ["correspond"], "adj": ["corresponding"] }
  },
  "w_b7_315": {
    "synonyms": ["standards", "principles", "measures", "benchmarks"],
    "wordFamily": { "noun": ["criterion", "criteria"] }
  },
  "w_b7_316": {
    "synonyms": ["grow", "develop", "foster", "nurture"],
    "wordFamily": { "noun": ["cultivation", "cultivator"], "verb": ["cultivate"], "adj": ["cultivated"] }
  },
  "w_b7_317": {
    "synonyms": ["series", "sequence", "rotation", "loop"],
    "wordFamily": { "noun": ["cycle", "cyclist"], "verb": ["cycle"], "adj": ["cyclic", "cyclical"] }
  },
  "w_b7_318": {
    "synonyms": ["ten years", "decennary"],
    "wordFamily": { "noun": ["decade"] }
  },
  "w_b7_319": {
    "synonyms": ["decrease", "drop", "fall", "refuse"],
    "wordFamily": { "noun": ["decline"], "verb": ["decline"] }
  },
  "w_b7_320": {
    "synonyms": ["conclude", "infer", "gather", "reason"],
    "wordFamily": { "noun": ["deduction"], "verb": ["deduce"], "adj": ["deductive"] }
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
console.log('Enriched w_b7_311 to w_b7_320');
