import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_351": {
    "synonyms": ["final", "ultimate", "concluding", "resulting"],
    "wordFamily": { "noun": ["eventuality"], "adj": ["eventual"], "adv": ["eventually"] }
  },
  "w_b7_352": {
    "synonyms": ["obvious", "clear", "apparent", "plain"],
    "wordFamily": { "noun": ["evidence"], "adj": ["evident"], "adv": ["evidently"] }
  },
  "w_b7_353": {
    "synonyms": ["growth", "increase", "enlargement", "extension"],
    "wordFamily": { "noun": ["expansion"], "verb": ["expand"], "adj": ["expansive"] }
  },
  "w_b7_354": {
    "synonyms": ["establish", "start", "create", "set up"],
    "wordFamily": { "noun": ["foundation", "founder"], "verb": ["found"], "adj": ["foundational"] }
  },
  "w_b7_355": {
    "synonyms": ["moreover", "in addition", "additionally", "also"],
    "wordFamily": {}
  },
  "w_b7_356": {
    "synonyms": ["recognize", "determine", "distinguish", "name"],
    "wordFamily": { "noun": ["identity", "identification"], "verb": ["identify"], "adj": ["identifiable"] }
  },
  "w_b7_357": {
    "synonyms": ["lack of knowledge", "unawareness", "inexperience", "innocence"],
    "wordFamily": { "noun": ["ignorance"], "verb": ["ignore"], "adj": ["ignorant"] }
  },
  "w_b7_358": {
    "synonyms": ["tend", "lean", "dispose", "slant"],
    "wordFamily": { "noun": ["inclination"], "verb": ["incline"], "adj": ["inclined"] }
  },
  "w_b7_359": {
    "synonyms": ["conflicting", "opposed", "mismatched", "unsuited"],
    "wordFamily": { "noun": ["incompatibility"], "adj": ["incompatible"] }
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
console.log('Enriched w_b7_351 to w_b7_359');
