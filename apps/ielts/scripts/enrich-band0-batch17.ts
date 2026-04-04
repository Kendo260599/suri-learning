import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_161": {
    "synonyms": ["downward", "lower", "below"],
    "wordFamily": { "adv": ["down", "downwards"] }
  },
  "w_b0_162": {
    "synonyms": ["ahead", "onward", "forth", "frontward"],
    "wordFamily": { "adj": ["forward"], "adv": ["forward", "forwards"], "verb": ["forward"] }
  },
  "w_b0_163": {
    "synonyms": ["rearward", "behind", "retrograde"],
    "wordFamily": { "adj": ["backward"], "adv": ["backward", "backwards"] }
  },
  "w_b0_164": {
    "synonyms": ["direct", "unswerving", "undeviating", "linear"],
    "wordFamily": { "adj": ["straight"], "adv": ["straight"], "noun": ["straightness"] }
  },
  "w_b0_165": {
    "synonyms": ["exterior", "outside", "facade", "veneer"],
    "wordFamily": { "noun": ["surface"], "verb": ["surface"], "adj": ["surface"] }
  },
  "w_b0_166": {
    "synonyms": ["inside", "inner part", "core", "center"],
    "wordFamily": { "noun": ["interior"], "adj": ["interior"] }
  },
  "w_b0_167": {
    "synonyms": ["outside", "surface", "facade", "shell"],
    "wordFamily": { "noun": ["exterior"], "adj": ["exterior"] }
  },
  "w_b0_168": {
    "synonyms": ["laterally", "edgeways", "obliquely"],
    "wordFamily": { "adv": ["sideways"], "adj": ["sideways"] }
  },
  "w_b0_169": {
    "synonyms": ["upright", "perpendicular", "plumb", "erect"],
    "wordFamily": { "adj": ["vertical"], "adv": ["vertically"] }
  },
  "w_b0_170": {
    "synonyms": ["level", "flat", "parallel", "even"],
    "wordFamily": { "adj": ["horizontal"], "adv": ["horizontally"] }
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
console.log('Enriched w_b0_161 to w_b0_170');
