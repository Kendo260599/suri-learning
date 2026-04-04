import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_201": {
    "synonyms": ["meeting", "convention", "seminar", "symposium"],
    "wordFamily": { "noun": ["conference"], "verb": ["confer"] }
  },
  "w_b7_202": {
    "synonyms": ["admit", "acknowledge", "own up", "disclose"],
    "wordFamily": { "noun": ["confession"], "verb": ["confess"] }
  },
  "w_b7_203": {
    "synonyms": ["admission", "acknowledgment", "disclosure", "revelation"],
    "wordFamily": { "noun": ["confession"], "verb": ["confess"] }
  },
  "w_b7_204": {
    "synonyms": ["paper fragments", "streamers"],
    "wordFamily": { "noun": ["confetti"] }
  },
  "w_b7_205": {
    "synonyms": ["close friend", "intimate", "companion", "trusted friend"],
    "wordFamily": { "noun": ["confidant", "confidence"], "verb": ["confide"] }
  },
  "w_b7_206": {
    "synonyms": ["trust", "entrust", "reveal", "disclose"],
    "wordFamily": { "noun": ["confidence", "confidant"], "verb": ["confide"], "adj": ["confident", "confidential"] }
  },
  "w_b7_207": {
    "synonyms": ["trust", "belief", "faith", "assurance"],
    "wordFamily": { "noun": ["confidence"], "verb": ["confide"], "adj": ["confident"], "adv": ["confidently"] }
  },
  "w_b7_208": {
    "synonyms": ["secret", "private", "classified", "restricted"],
    "wordFamily": { "noun": ["confidentiality"], "adj": ["confidential"], "adv": ["confidentially"] }
  },
  "w_b7_209": {
    "synonyms": ["arrangement", "layout", "setup", "formation"],
    "wordFamily": { "noun": ["configuration"], "verb": ["configure"] }
  },
  "w_b7_210": {
    "synonyms": ["verify", "corroborate", "validate", "prove"],
    "wordFamily": { "noun": ["confirmation"], "verb": ["confirm"], "adj": ["confirmed"] }
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
console.log('Enriched w_b7_201 to w_b7_210');
