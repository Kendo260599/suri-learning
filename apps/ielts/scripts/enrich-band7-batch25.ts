import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_241": {
    "synonyms": ["dedicate", "devote", "sanctify", "bless"],
    "wordFamily": { "noun": ["consecration"], "verb": ["consecrate"] }
  },
  "w_b7_242": {
    "synonyms": ["successive", "sequential", "following", "continuous"],
    "wordFamily": { "adj": ["consecutive"], "adv": ["consecutively"] }
  },
  "w_b7_243": {
    "synonyms": ["agreement", "harmony", "accord", "unanimity"],
    "wordFamily": { "noun": ["consensus"] }
  },
  "w_b7_244": {
    "synonyms": ["agreement", "permission", "approval", "assent"],
    "wordFamily": { "noun": ["consent"], "verb": ["consent"] }
  },
  "w_b7_245": {
    "synonyms": ["therefore", "as a result", "thus", "hence"],
    "wordFamily": { "noun": ["consequence"], "adj": ["consequent"], "adv": ["consequently"] }
  },
  "w_b7_246": {
    "synonyms": ["traditional", "conventional", "cautious", "orthodox"],
    "wordFamily": { "noun": ["conservative", "conservatism"], "adj": ["conservative"], "adv": ["conservatively"] }
  },
  "w_b7_247": {
    "synonyms": ["significantly", "substantially", "greatly", "much"],
    "wordFamily": { "noun": ["consideration"], "verb": ["consider"], "adj": ["considerable"], "adv": ["considerably"] }
  },
  "w_b7_248": {
    "synonyms": ["thought", "deliberation", "reflection", "attention"],
    "wordFamily": { "noun": ["consideration"], "verb": ["consider"], "adj": ["considerate"] }
  },
  "w_b7_249": {
    "synonyms": ["comprise", "contain", "include", "be composed of"],
    "wordFamily": { "noun": ["consistency"], "verb": ["consist"], "adj": ["consistent"] }
  },
  "w_b7_250": {
    "synonyms": ["steady", "stable", "constant", "reliable"],
    "wordFamily": { "noun": ["consistency"], "verb": ["consist"], "adj": ["consistent"], "adv": ["consistently"] }
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
console.log('Enriched w_b7_241 to w_b7_250');
