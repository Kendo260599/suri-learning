import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_131": {
    "synonyms": ["convey", "carry", "move", "transfer"],
    "wordFamily": { "noun": ["transport", "transportation"], "verb": ["transport"] }
  },
  "w_b7_132": {
    "synonyms": ["examine", "study", "evaluate", "investigate"],
    "wordFamily": { "noun": ["analysis", "analyst"], "verb": ["analyze"], "adj": ["analytical"], "adv": ["analytically"] }
  },
  "w_b7_133": {
    "synonyms": ["yearly", "once a year", "each year"],
    "wordFamily": { "noun": ["annual"], "adj": ["annual"], "adv": ["annually"] }
  },
  "w_b7_134": {
    "synonyms": ["expect", "predict", "foresee", "await"],
    "wordFamily": { "noun": ["anticipation"], "verb": ["anticipate"], "adj": ["anticipatory"] }
  },
  "w_b7_135": {
    "synonyms": ["obvious", "clear", "evident", "visible"],
    "wordFamily": { "adj": ["apparent"], "adv": ["apparently"] }
  },
  "w_b7_136": {
    "synonyms": ["add", "attach", "join", "affix"],
    "wordFamily": { "noun": ["appendix", "appendage"], "verb": ["append"] }
  },
  "w_b7_137": {
    "synonyms": ["value", "respect", "cherish", "acknowledge"],
    "wordFamily": { "noun": ["appreciation"], "verb": ["appreciate"], "adj": ["appreciative"], "adv": ["appreciatively"] }
  },
  "w_b7_138": {
    "synonyms": ["method", "way", "strategy", "technique"],
    "wordFamily": { "noun": ["approach"], "verb": ["approach"], "adj": ["approachable"] }
  },
  "w_b7_139": {
    "synonyms": ["suitable", "fitting", "proper", "right"],
    "wordFamily": { "verb": ["appropriate"], "adj": ["appropriate"], "adv": ["appropriately"] }
  },
  "w_b7_140": {
    "synonyms": ["estimated", "rough", "inexact", "near"],
    "wordFamily": { "noun": ["approximation"], "verb": ["approximate"], "adj": ["approximate"], "adv": ["approximately"] }
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
console.log('Enriched w_b7_131 to w_b7_140');
