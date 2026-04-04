import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_111": {
    "synonyms": ["significant", "important", "main", "key"],
    "wordFamily": { "noun": ["majority", "major"], "verb": ["major"], "adj": ["major"] }
  },
  "w_b7_112": {
    "synonyms": ["watch", "notice", "see", "monitor"],
    "wordFamily": { "noun": ["observation", "observer"], "verb": ["observe"], "adj": ["observant"] }
  },
  "w_b7_113": {
    "synonyms": ["clear", "evident", "apparent", "plain"],
    "wordFamily": { "adj": ["obvious"], "adv": ["obviously"] }
  },
  "w_b7_114": {
    "synonyms": ["inhabit", "live in", "take up", "fill"],
    "wordFamily": { "noun": ["occupation", "occupant"], "verb": ["occupy"], "adj": ["occupied", "occupational"] }
  },
  "w_b7_115": {
    "synonyms": ["happen", "take place", "arise", "appear"],
    "wordFamily": { "noun": ["occurrence"], "verb": ["occur"] }
  },
  "w_b7_116": {
    "synonyms": ["strange", "unusual", "peculiar", "weird"],
    "wordFamily": { "noun": ["oddity", "odds"], "adj": ["odd"], "adv": ["oddly"] }
  },
  "w_b7_117": {
    "synonyms": ["counterbalance", "compensate for", "cancel out", "make up for"],
    "wordFamily": { "noun": ["offset"], "verb": ["offset"] }
  },
  "w_b7_118": {
    "synonyms": ["continuous", "continuing", "in progress", "underway"],
    "wordFamily": { "adj": ["ongoing"] }
  },
  "w_b7_119": {
    "synonyms": ["choice", "alternative", "possibility", "selection"],
    "wordFamily": { "noun": ["option"], "verb": ["opt"], "adj": ["optional"], "adv": ["optionally"] }
  },
  "w_b7_120": {
    "synonyms": ["align", "direct", "position", "guide"],
    "wordFamily": { "noun": ["orientation"], "verb": ["orient", "orientate"], "adj": ["oriented"] }
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
console.log('Enriched w_b7_111 to w_b7_120');
