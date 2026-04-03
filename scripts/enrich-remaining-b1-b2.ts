import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b1_6": {
    "synonyms": ["dawn", "sunrise", "forenoon", "morn"],
    "wordFamily": { "noun": ["morning"] }
  },
  "w_b1_7": {
    "synonyms": ["dusk", "twilight", "nightfall", "sundown"],
    "wordFamily": { "noun": ["evening"] }
  },
  "w_b1_8": {
    "synonyms": ["post meridiem", "PM"],
    "wordFamily": { "noun": ["afternoon"] }
  },
  "w_b1_9": {
    "synonyms": ["evening", "darkness", "nighttime", "midnight"],
    "wordFamily": { "noun": ["night", "nighttime"], "adj": ["nightly"], "adv": ["nightly"] }
  },
  "w_b2_32": {
    "synonyms": ["be part of", "fit in", "go with", "be owned by"],
    "wordFamily": { "noun": ["belongings"], "verb": ["belong"] }
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
console.log('Enriched remaining words in Band 1 and Band 2');
