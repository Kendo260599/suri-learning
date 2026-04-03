import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_151": {
    "synonyms": ["ease", "relaxation", "relief", "consolation"],
    "wordFamily": { "noun": ["comfort", "comforter"], "verb": ["comfort"], "adj": ["comfortable", "comforting"], "adv": ["comfortably"] }
  },
  "w_b7_152": {
    "synonyms": ["order", "directive", "instruction", "control"],
    "wordFamily": { "noun": ["command", "commander"], "verb": ["command"], "adj": ["commanding"] }
  },
  "w_b7_153": {
    "synonyms": ["remark", "observation", "statement", "opinion"],
    "wordFamily": { "noun": ["comment", "commentary", "commentator"], "verb": ["comment"] }
  },
  "w_b7_154": {
    "synonyms": ["trade", "business", "buying and selling", "dealing"],
    "wordFamily": { "noun": ["commerce"], "adj": ["commercial"], "adv": ["commercially"] }
  },
  "w_b7_155": {
    "synonyms": ["committee", "board", "council", "fee"],
    "wordFamily": { "noun": ["commission", "commissioner"], "verb": ["commission"] }
  },
  "w_b7_156": {
    "synonyms": ["perform", "carry out", "do", "execute"],
    "wordFamily": { "noun": ["commitment"], "verb": ["commit"], "adj": ["committed"] }
  },
  "w_b7_157": {
    "synonyms": ["board", "council", "panel", "commission"],
    "wordFamily": { "noun": ["committee"] }
  },
  "w_b7_158": {
    "synonyms": ["usual", "ordinary", "frequent", "widespread"],
    "wordFamily": { "noun": ["commoner"], "adj": ["common"], "adv": ["commonly"] }
  },
  "w_b7_159": {
    "synonyms": ["convey", "transmit", "pass on", "interact"],
    "wordFamily": { "noun": ["communication", "communicator"], "verb": ["communicate"], "adj": ["communicative"] }
  },
  "w_b7_160": {
    "synonyms": ["business", "firm", "corporation", "enterprise"],
    "wordFamily": { "noun": ["company", "companion"], "verb": ["accompany"] }
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
console.log('Enriched w_b7_151 to w_b7_160');
