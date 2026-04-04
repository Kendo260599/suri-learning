import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_111": {
    "synonyms": ["adaptable", "versatile", "pliable", "supple"],
    "wordFamily": { "noun": ["flexibility"], "adj": ["flexible"], "adv": ["flexibly"] }
  },
  "w_b6_112": {
    "synonyms": ["layout", "design", "arrangement", "structure"],
    "wordFamily": { "noun": ["format"], "verb": ["format"] }
  },
  "w_b6_113": {
    "synonyms": ["method", "recipe", "equation", "plan"],
    "wordFamily": { "noun": ["formula", "formulation"], "verb": ["formulate"], "adj": ["formulaic"] }
  },
  "w_b6_114": {
    "synonyms": ["upcoming", "approaching", "imminent", "available"],
    "wordFamily": { "adj": ["forthcoming"] }
  },
  "w_b6_115": {
    "synonyms": ["basis", "groundwork", "institution", "base"],
    "wordFamily": { "noun": ["foundation", "founder"], "verb": ["found"], "adj": ["foundational"] }
  },
  "w_b6_116": {
    "synonyms": ["part", "portion", "fragment", "segment"],
    "wordFamily": { "noun": ["fraction"], "adj": ["fractional"] }
  },
  "w_b6_117": {
    "synonyms": ["disposed", "prone", "tending", "sloping"],
    "wordFamily": { "noun": ["inclination"], "verb": ["incline"], "adj": ["inclined"] }
  },
  "w_b6_118": {
    "synonyms": ["earnings", "revenue", "salary", "pay"],
    "wordFamily": { "noun": ["income"] }
  },
  "w_b6_119": {
    "synonyms": ["include", "integrate", "embody", "combine"],
    "wordFamily": { "noun": ["incorporation"], "verb": ["incorporate"], "adj": ["incorporated"] }
  },
  "w_b6_120": {
    "synonyms": ["indicator", "guide", "list", "pointer"],
    "wordFamily": { "noun": ["index"], "verb": ["index"] }
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
console.log('Enriched w_b6_111 to w_b6_120');
