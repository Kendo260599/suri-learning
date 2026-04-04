import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_161": {
    "synonyms": ["contrast", "juxtapose", "weigh", "measure"],
    "wordFamily": { "noun": ["comparison"], "verb": ["compare"], "adj": ["comparable", "comparative"], "adv": ["comparably", "comparatively"] }
  },
  "w_b7_162": {
    "synonyms": ["contrast", "juxtaposition", "analogy", "correlation"],
    "wordFamily": { "noun": ["comparison"], "verb": ["compare"], "adj": ["comparable", "comparative"], "adv": ["comparably", "comparatively"] }
  },
  "w_b7_163": {
    "synonyms": ["recompense", "repayment", "reimbursement", "damages"],
    "wordFamily": { "noun": ["compensation"], "verb": ["compensate"], "adj": ["compensatory"] }
  },
  "w_b7_164": {
    "synonyms": ["contend", "vie", "fight", "strive"],
    "wordFamily": { "noun": ["competition", "competitor"], "verb": ["compete"], "adj": ["competitive"], "adv": ["competitively"] }
  },
  "w_b7_165": {
    "synonyms": ["ambitious", "driven", "cutthroat", "aggressive"],
    "wordFamily": { "noun": ["competition", "competitor"], "verb": ["compete"], "adj": ["competitive"], "adv": ["competitively"] }
  },
  "w_b7_166": {
    "synonyms": ["rival", "opponent", "challenger", "contender"],
    "wordFamily": { "noun": ["competition", "competitor"], "verb": ["compete"], "adj": ["competitive"], "adv": ["competitively"] }
  },
  "w_b7_167": {
    "synonyms": ["assemble", "collect", "gather", "put together"],
    "wordFamily": { "noun": ["compilation"], "verb": ["compile"] }
  },
  "w_b7_168": {
    "synonyms": ["grumble", "moan", "whine", "protest"],
    "wordFamily": { "noun": ["complaint"], "verb": ["complain"] }
  },
  "w_b7_169": {
    "synonyms": ["grievance", "objection", "protest", "criticism"],
    "wordFamily": { "noun": ["complaint"], "verb": ["complain"] }
  },
  "w_b7_170": {
    "synonyms": ["accompaniment", "addition", "enhancement", "companion"],
    "wordFamily": { "noun": ["complement"], "verb": ["complement"], "adj": ["complementary"] }
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
console.log('Enriched w_b7_161 to w_b7_170');
