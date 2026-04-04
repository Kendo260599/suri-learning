import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_301": {
    "synonyms": ["communicate", "express", "transmit", "pass on"],
    "wordFamily": { "noun": ["conveyance"], "verb": ["convey"] }
  },
  "w_b7_302": {
    "synonyms": ["find guilty", "sentence", "condemn", "prisoner"],
    "wordFamily": { "noun": ["convict", "conviction"], "verb": ["convict"] }
  },
  "w_b7_303": {
    "synonyms": ["belief", "certainty", "sentence", "judgment"],
    "wordFamily": { "noun": ["conviction", "convict"], "verb": ["convict"] }
  },
  "w_b7_304": {
    "synonyms": ["certain", "sure", "positive", "confident"],
    "wordFamily": { "verb": ["convince"], "adj": ["convinced", "convincing"] }
  },
  "w_b7_305": {
    "synonyms": ["persuasive", "compelling", "plausible", "credible"],
    "wordFamily": { "verb": ["convince"], "adj": ["convincing", "convinced"], "adv": ["convincingly"] }
  },
  "w_b7_306": {
    "synonyms": ["collaboration", "teamwork", "assistance", "support"],
    "wordFamily": { "noun": ["cooperation"], "verb": ["cooperate"], "adj": ["cooperative"] }
  },
  "w_b7_307": {
    "synonyms": ["helpful", "collaborative", "accommodating", "willing"],
    "wordFamily": { "noun": ["cooperation", "cooperative"], "verb": ["cooperate"], "adj": ["cooperative"], "adv": ["cooperatively"] }
  },
  "w_b7_308": {
    "synonyms": ["organize", "manage", "harmonize", "synchronize"],
    "wordFamily": { "noun": ["coordination", "coordinator"], "verb": ["coordinate"] }
  },
  "w_b7_309": {
    "synonyms": ["organization", "management", "synchronization", "harmony"],
    "wordFamily": { "noun": ["coordination", "coordinator"], "verb": ["coordinate"] }
  },
  "w_b7_310": {
    "synonyms": ["organizer", "manager", "director", "facilitator"],
    "wordFamily": { "noun": ["coordinator", "coordination"], "verb": ["coordinate"] }
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
console.log('Enriched w_b7_301 to w_b7_310');
