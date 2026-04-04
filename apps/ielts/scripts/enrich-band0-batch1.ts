import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_1": {
    "synonyms": ["hi", "greetings", "hey", "howdy"],
    "wordFamily": { "noun": ["hello"] }
  },
  "w_b0_2": {
    "synonyms": ["farewell", "bye", "see you", "so long"],
    "wordFamily": { "noun": ["goodbye"] }
  },
  "w_b0_3": {
    "synonyms": ["yeah", "yep", "certainly", "absolutely"],
    "wordFamily": { "noun": ["yes"] }
  },
  "w_b0_4": {
    "synonyms": ["nah", "negative", "not at all", "never"],
    "wordFamily": { "noun": ["no"] }
  },
  "w_b0_5": {
    "synonyms": ["kindly", "if you please"],
    "wordFamily": { "verb": ["please"], "adj": ["pleased", "pleasing"] }
  },
  "w_b0_6": {
    "synonyms": ["thanks", "appreciation", "gratitude"],
    "wordFamily": { "noun": ["thanks", "thankfulness"], "verb": ["thank"], "adj": ["thankful"] }
  },
  "w_b0_7": {
    "synonyms": ["apologies", "regretful", "apologetic"],
    "wordFamily": { "noun": ["sorrow"], "adj": ["sorry"] }
  },
  "w_b0_8": {
    "synonyms": ["guy", "gentleman", "male", "boy"],
    "wordFamily": { "noun": ["man", "manhood", "mankind"], "adj": ["manly"] }
  },
  "w_b0_9": {
    "synonyms": ["lady", "female", "girl"],
    "wordFamily": { "noun": ["woman", "womanhood"], "adj": ["womanly"] }
  },
  "w_b0_10": {
    "synonyms": ["volume", "tome", "publication", "novel"],
    "wordFamily": { "noun": ["book", "booking"], "verb": ["book"] }
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
console.log('Enriched w_b0_1 to w_b0_10');
