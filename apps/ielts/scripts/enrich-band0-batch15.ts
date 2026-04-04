import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_141": {
    "synonyms": ["border", "margin", "brink", "rim"],
    "wordFamily": { "noun": ["edge"], "verb": ["edge"], "adj": ["edgy"] }
  },
  "w_b0_142": {
    "synonyms": ["center", "midst", "midpoint", "core"],
    "wordFamily": { "noun": ["middle"], "adj": ["middle"] }
  },
  "w_b0_143": {
    "synonyms": ["middle", "core", "heart", "hub"],
    "wordFamily": { "noun": ["center"], "verb": ["center"], "adj": ["central"], "adv": ["centrally"] }
  },
  "w_b0_144": {
    "synonyms": ["edge", "border", "flank", "surface"],
    "wordFamily": { "noun": ["side"], "verb": ["side"], "adj": ["sided"] }
  },
  "w_b0_145": {
    "synonyms": ["fore", "head", "face", "lead"],
    "wordFamily": { "noun": ["front"], "verb": ["front"], "adj": ["front", "frontal"] }
  },
  "w_b0_146": {
    "synonyms": ["rear", "behind", "reverse", "spine"],
    "wordFamily": { "noun": ["back", "backing"], "verb": ["back"], "adj": ["back", "backward"], "adv": ["back", "backwards"] }
  },
  "w_b0_147": {
    "synonyms": ["peak", "summit", "crest", "crown"],
    "wordFamily": { "noun": ["top"], "verb": ["top"], "adj": ["top"] }
  },
  "w_b0_148": {
    "synonyms": ["base", "foot", "foundation", "underside"],
    "wordFamily": { "noun": ["bottom"], "verb": ["bottom"], "adj": ["bottom"] }
  },
  "w_b0_149": {
    "synonyms": ["port", "left-hand", "remaining", "departed"],
    "wordFamily": { "noun": ["left"], "verb": ["leave"], "adj": ["left"] }
  },
  "w_b0_150": {
    "synonyms": ["correct", "true", "accurate", "proper"],
    "wordFamily": { "noun": ["right", "rights"], "verb": ["right"], "adj": ["right", "righteous"], "adv": ["right", "rightly"] }
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
console.log('Enriched w_b0_141 to w_b0_150');
