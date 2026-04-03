import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_331": {
    "synonyms": ["distinguish", "discriminate", "tell apart", "contrast"],
    "wordFamily": { "noun": ["difference", "differentiation"], "verb": ["differentiate"], "adj": ["different"] }
  },
  "w_b7_332": {
    "synonyms": ["discard", "throw away", "get rid of", "arrange"],
    "wordFamily": { "noun": ["disposal", "disposition"], "verb": ["dispose"], "adj": ["disposable"] }
  },
  "w_b7_333": {
    "synonyms": ["clear", "obvious", "separate", "different"],
    "wordFamily": { "noun": ["distinction"], "adj": ["distinct", "distinctive"], "adv": ["distinctly"] }
  },
  "w_b7_334": {
    "synonyms": ["give out", "hand out", "share", "circulate"],
    "wordFamily": { "noun": ["distribution", "distributor"], "verb": ["distribute"], "adj": ["distributive"] }
  },
  "w_b7_335": {
    "synonyms": ["record", "paper", "file", "certificate"],
    "wordFamily": { "noun": ["document", "documentation", "documentary"], "verb": ["document"] }
  },
  "w_b7_336": {
    "synonyms": ["national", "internal", "home", "household"],
    "wordFamily": { "noun": ["domesticity"], "verb": ["domesticate"], "adj": ["domestic"], "adv": ["domestically"] }
  },
  "w_b7_337": {
    "synonyms": ["control", "rule", "govern", "command"],
    "wordFamily": { "noun": ["domination", "dominance"], "verb": ["dominate"], "adj": ["dominant"] }
  },
  "w_b7_338": {
    "synonyms": ["play", "show", "theatre", "excitement"],
    "wordFamily": { "noun": ["drama", "dramatist"], "verb": ["dramatize"], "adj": ["dramatic"], "adv": ["dramatically"] }
  },
  "w_b7_339": {
    "synonyms": ["component", "part", "factor", "feature"],
    "wordFamily": { "noun": ["element"], "adj": ["elementary"] }
  },
  "w_b7_340": {
    "synonyms": ["appear", "come out", "arise", "surface"],
    "wordFamily": { "noun": ["emergence", "emergency"], "verb": ["emerge"], "adj": ["emergent"] }
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
console.log('Enriched w_b7_331 to w_b7_340');
