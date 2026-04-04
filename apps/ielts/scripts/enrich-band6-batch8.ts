import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_71": {
    "synonyms": ["charter", "code", "composition", "structure"],
    "wordFamily": { "noun": ["constitution", "constituent"], "verb": ["constitute"], "adj": ["constitutional"], "adv": ["constitutionally"] }
  },
  "w_b6_72": {
    "synonyms": ["lawmaking", "statutes", "regulations", "acts"],
    "wordFamily": { "noun": ["legislation", "legislator", "legislature"], "verb": ["legislate"], "adj": ["legislative"] }
  },
  "w_b6_73": {
    "synonyms": ["bench", "judges", "court system"],
    "wordFamily": { "noun": ["judiciary", "judge", "judgment"], "verb": ["judge"], "adj": ["judicial"], "adv": ["judicially"] }
  },
  "w_b6_74": {
    "synonyms": ["administrator", "manager", "director", "official"],
    "wordFamily": { "noun": ["executive", "execution", "executor"], "verb": ["execute"], "adj": ["executive", "executable"] }
  },
  "w_b6_75": {
    "synonyms": ["parliament", "congress", "senate", "council"],
    "wordFamily": { "noun": ["legislature", "legislator", "legislation"], "verb": ["legislate"], "adj": ["legislative"] }
  },
  "w_b6_76": {
    "synonyms": ["autonomy", "independence", "self-rule", "dominion"],
    "wordFamily": { "noun": ["sovereignty", "sovereign"], "adj": ["sovereign"] }
  },
  "w_b6_77": {
    "synonyms": ["movement", "relocation", "displacement", "immigration"],
    "wordFamily": { "noun": ["migration", "migrant", "emigration", "immigration"], "verb": ["migrate", "emigrate", "immigrate"], "adj": ["migratory"] }
  },
  "w_b6_78": {
    "synonyms": ["civil liberties", "fundamental rights", "natural rights"],
    "wordFamily": { "noun": ["human rights"] }
  },
  "w_b6_79": {
    "synonyms": ["penury", "destitution", "indigence", "want"],
    "wordFamily": { "noun": ["poverty", "poor"], "adj": ["poor"], "adv": ["poorly"] }
  },
  "w_b6_80": {
    "synonyms": ["disparity", "imbalance", "unfairness", "bias"],
    "wordFamily": { "noun": ["inequality", "equality"], "adj": ["unequal"], "adv": ["unequally"] }
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
console.log('Enriched w_b6_71 to w_b6_80');
