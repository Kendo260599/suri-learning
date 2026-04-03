import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_191": {
    "synonyms": ["brief", "short", "succinct", "to the point"],
    "wordFamily": { "noun": ["conciseness"], "adj": ["concise"], "adv": ["concisely"] }
  },
  "w_b7_192": {
    "synonyms": ["finish", "end", "close", "deduce"],
    "wordFamily": { "noun": ["conclusion"], "verb": ["conclude"], "adj": ["conclusive"], "adv": ["conclusively"] }
  },
  "w_b7_193": {
    "synonyms": ["censure", "criticize", "denounce", "sentence"],
    "wordFamily": { "noun": ["condemnation"], "verb": ["condemn"], "adj": ["condemnatory"] }
  },
  "w_b7_194": {
    "synonyms": ["precipitation", "moisture", "compression", "abridgment"],
    "wordFamily": { "noun": ["condensation"], "verb": ["condense"] }
  },
  "w_b7_195": {
    "synonyms": ["compress", "concentrate", "abridge", "shorten"],
    "wordFamily": { "noun": ["condensation"], "verb": ["condense"] }
  },
  "w_b7_196": {
    "synonyms": ["dependent", "contingent", "provisional", "qualified"],
    "wordFamily": { "noun": ["condition"], "verb": ["condition"], "adj": ["conditional"], "adv": ["conditionally"] }
  },
  "w_b7_197": {
    "synonyms": ["sympathy", "compassion", "pity", "commiseration"],
    "wordFamily": { "noun": ["condolence"], "verb": ["condole"] }
  },
  "w_b7_198": {
    "synonyms": ["overlook", "forgive", "excuse", "pardon"],
    "wordFamily": { "verb": ["condone"] }
  },
  "w_b7_199": {
    "synonyms": ["behavior", "management", "carry out", "direct"],
    "wordFamily": { "noun": ["conduct", "conductor"], "verb": ["conduct"] }
  },
  "w_b7_200": {
    "synonyms": ["director", "leader", "guide", "manager"],
    "wordFamily": { "noun": ["conductor", "conduct"], "verb": ["conduct"] }
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
console.log('Enriched w_b7_191 to w_b7_200');
