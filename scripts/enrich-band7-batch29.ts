import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_281": {
    "synonyms": ["keep on", "carry on", "persist", "proceed"],
    "wordFamily": { "noun": ["continuation", "continuity"], "verb": ["continue"], "adj": ["continuous", "continual"] }
  },
  "w_b7_282": {
    "synonyms": ["uninterrupted", "unbroken", "constant", "nonstop"],
    "wordFamily": { "noun": ["continuity", "continuation"], "verb": ["continue"], "adj": ["continuous"], "adv": ["continuously"] }
  },
  "w_b7_283": {
    "synonyms": ["constantly", "uninterruptedly", "nonstop", "endlessly"],
    "wordFamily": { "noun": ["continuity"], "verb": ["continue"], "adj": ["continuous"], "adv": ["continuously"] }
  },
  "w_b7_284": {
    "synonyms": ["deny", "refute", "counter", "oppose"],
    "wordFamily": { "noun": ["contradiction"], "verb": ["contradict"], "adj": ["contradictory"] }
  },
  "w_b7_285": {
    "synonyms": ["opposing", "conflicting", "inconsistent", "opposite"],
    "wordFamily": { "noun": ["contradiction"], "verb": ["contradict"], "adj": ["contradictory"] }
  },
  "w_b7_286": {
    "synonyms": ["opposite", "opposing", "clashing", "reverse"],
    "wordFamily": { "noun": ["contrary"], "adj": ["contrary"], "adv": ["contrarily"] }
  },
  "w_b7_287": {
    "synonyms": ["difference", "comparison", "dissimilarity", "distinction"],
    "wordFamily": { "noun": ["contrast"], "verb": ["contrast"], "adj": ["contrasting"] }
  },
  "w_b7_288": {
    "synonyms": ["donate", "give", "provide", "supply"],
    "wordFamily": { "noun": ["contribution", "contributor"], "verb": ["contribute"], "adj": ["contributory"] }
  },
  "w_b7_289": {
    "synonyms": ["donor", "backer", "supporter", "participant"],
    "wordFamily": { "noun": ["contribution", "contributor"], "verb": ["contribute"] }
  },
  "w_b7_290": {
    "synonyms": ["dispute", "debate", "argument", "disagreement"],
    "wordFamily": { "noun": ["controversy"], "adj": ["controversial"], "adv": ["controversially"] }
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
console.log('Enriched w_b7_281 to w_b7_290');
