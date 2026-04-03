import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_111": {
    "synonyms": ["cove", "inlet", "gulf", "bight"],
    "wordFamily": { "noun": ["bay"] }
  },
  "w_b0_112": {
    "synonyms": ["port", "dock", "haven", "marina"],
    "wordFamily": { "noun": ["harbour"], "verb": ["harbour"] }
  },
  "w_b0_113": {
    "synonyms": ["spire", "steeple", "pillar", "column"],
    "wordFamily": { "noun": ["tower"], "verb": ["tower"], "adj": ["towering"] }
  },
  "w_b0_114": {
    "synonyms": ["sculpture", "figure", "effigy", "carving"],
    "wordFamily": { "noun": ["statue", "statuette"], "adj": ["statuesque"] }
  },
  "w_b0_115": {
    "synonyms": ["spring", "jet", "spout", "water feature"],
    "wordFamily": { "noun": ["fountain"] }
  },
  "w_b0_116": {
    "synonyms": ["plaza", "piazza", "quadrangle", "green"],
    "wordFamily": { "noun": ["square"], "verb": ["square"], "adj": ["square"], "adv": ["squarely"] }
  },
  "w_b0_117": {
    "synonyms": ["memorial", "statue", "pillar", "shrine"],
    "wordFamily": { "noun": ["monument"], "adj": ["monumental"], "adv": ["monumentally"] }
  },
  "w_b0_118": {
    "synonyms": ["castle", "mansion", "chateau", "residence"],
    "wordFamily": { "noun": ["palace"] }
  },
  "w_b0_119": {
    "synonyms": ["fortress", "fort", "citadel", "palace"],
    "wordFamily": { "noun": ["castle"] }
  },
  "w_b0_120": {
    "synonyms": ["gallery", "exhibition", "repository", "archive"],
    "wordFamily": { "noun": ["museum"] }
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
console.log('Enriched w_b0_111 to w_b0_120');
