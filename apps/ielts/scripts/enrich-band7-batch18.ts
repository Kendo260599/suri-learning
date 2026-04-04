import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_171": {
    "synonyms": ["complicated", "intricate", "involved", "difficult"],
    "wordFamily": { "noun": ["complexity", "complex"], "verb": ["complicate"], "adj": ["complex"] }
  },
  "w_b7_172": {
    "synonyms": ["confuse", "muddle", "entangle", "make difficult"],
    "wordFamily": { "noun": ["complication"], "verb": ["complicate"], "adj": ["complicated"] }
  },
  "w_b7_173": {
    "synonyms": ["complex", "intricate", "difficult", "involved"],
    "wordFamily": { "noun": ["complication"], "verb": ["complicate"], "adj": ["complicated"] }
  },
  "w_b7_174": {
    "synonyms": ["write", "create", "form", "make up"],
    "wordFamily": { "noun": ["composition", "composer"], "verb": ["compose"] }
  },
  "w_b7_175": {
    "synonyms": ["makeup", "structure", "formation", "creation"],
    "wordFamily": { "noun": ["composition", "composer"], "verb": ["compose"] }
  },
  "w_b7_176": {
    "synonyms": ["mixture", "blend", "combination", "composite"],
    "wordFamily": { "noun": ["compound"], "verb": ["compound"], "adj": ["compound"] }
  },
  "w_b7_177": {
    "synonyms": ["understand", "grasp", "take in", "apprehend"],
    "wordFamily": { "noun": ["comprehension"], "verb": ["comprehend"], "adj": ["comprehensible"] }
  },
  "w_b7_178": {
    "synonyms": ["understanding", "grasp", "awareness", "perception"],
    "wordFamily": { "noun": ["comprehension"], "verb": ["comprehend"], "adj": ["comprehensible"] }
  },
  "w_b7_179": {
    "synonyms": ["complete", "thorough", "full", "inclusive"],
    "wordFamily": { "adj": ["comprehensive"], "adv": ["comprehensively"] }
  },
  "w_b7_180": {
    "synonyms": ["agreement", "understanding", "settlement", "middle ground"],
    "wordFamily": { "noun": ["compromise"], "verb": ["compromise"] }
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
console.log('Enriched w_b7_171 to w_b7_180');
