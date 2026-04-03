import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_121": {
    "synonyms": ["permit", "certificate", "authorization", "warrant"],
    "wordFamily": { "noun": ["license", "licensee"], "verb": ["license"] }
  },
  "w_b7_122": {
    "synonyms": ["least", "lowest", "minimal", "bottom"],
    "wordFamily": { "noun": ["minimum"], "verb": ["minimize"], "adj": ["minimal"], "adv": ["minimally"] }
  },
  "w_b7_123": {
    "synonyms": ["record", "message", "memo", "letter"],
    "wordFamily": { "noun": ["note", "notation"], "verb": ["note"], "adj": ["notable"], "adv": ["notably"] }
  },
  "w_b7_124": {
    "synonyms": ["thus", "therefore", "consequently", "as a result"],
    "wordFamily": { "adv": ["thereby"] }
  },
  "w_b7_125": {
    "synonyms": ["subject", "theme", "issue", "matter"],
    "wordFamily": { "noun": ["topic"], "adj": ["topical"], "adv": ["topically"] }
  },
  "w_b7_126": {
    "synonyms": ["track", "find", "discover", "detect"],
    "wordFamily": { "noun": ["trace"], "verb": ["trace"], "adj": ["traceable"] }
  },
  "w_b7_127": {
    "synonyms": ["move", "relocate", "shift", "transport"],
    "wordFamily": { "noun": ["transfer", "transference"], "verb": ["transfer"], "adj": ["transferable"] }
  },
  "w_b7_128": {
    "synonyms": ["change", "alter", "convert", "modify"],
    "wordFamily": { "noun": ["transformation"], "verb": ["transform"] }
  },
  "w_b7_129": {
    "synonyms": ["transport", "movement", "travel", "journey"],
    "wordFamily": { "noun": ["transit", "transition"], "verb": ["transit"], "adj": ["transitional"] }
  },
  "w_b7_130": {
    "synonyms": ["broadcast", "send", "convey", "pass on"],
    "wordFamily": { "noun": ["transmission", "transmitter"], "verb": ["transmit"] }
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
console.log('Enriched w_b7_121 to w_b7_130');
