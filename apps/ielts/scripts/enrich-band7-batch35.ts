import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_341": {
    "synonyms": ["importance", "stress", "significance", "weight"],
    "wordFamily": { "noun": ["emphasis"], "verb": ["emphasize"], "adj": ["emphatic"], "adv": ["emphatically"] }
  },
  "w_b7_342": {
    "synonyms": ["allow", "permit", "facilitate", "empower"],
    "wordFamily": { "verb": ["enable"], "adj": ["unable"] }
  },
  "w_b7_343": {
    "synonyms": ["meet", "experience", "face", "come across"],
    "wordFamily": { "noun": ["encounter"], "verb": ["encounter"] }
  },
  "w_b7_344": {
    "synonyms": ["make sure", "guarantee", "secure", "confirm"],
    "wordFamily": { "verb": ["ensure"] }
  },
  "w_b7_345": {
    "synonyms": ["provide", "supply", "furnish", "prepare"],
    "wordFamily": { "noun": ["equipment"], "verb": ["equip"] }
  },
  "w_b7_346": {
    "synonyms": ["equal", "comparable", "same", "corresponding"],
    "wordFamily": { "noun": ["equivalence"], "adj": ["equivalent"] }
  },
  "w_b7_347": {
    "synonyms": ["wear away", "corrode", "deteriorate", "destroy"],
    "wordFamily": { "noun": ["erosion"], "verb": ["erode"], "adj": ["erosive"] }
  },
  "w_b7_348": {
    "synonyms": ["set up", "found", "create", "start"],
    "wordFamily": { "noun": ["establishment"], "verb": ["establish"], "adj": ["established"] }
  },
  "w_b7_349": {
    "synonyms": ["guess", "calculate", "assess", "evaluate"],
    "wordFamily": { "noun": ["estimate", "estimation"], "verb": ["estimate"], "adj": ["estimated"] }
  },
  "w_b7_350": {
    "synonyms": ["assess", "appraise", "judge", "rate"],
    "wordFamily": { "noun": ["evaluation", "evaluator"], "verb": ["evaluate"], "adj": ["evaluative"] }
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
console.log('Enriched w_b7_341 to w_b7_350');
