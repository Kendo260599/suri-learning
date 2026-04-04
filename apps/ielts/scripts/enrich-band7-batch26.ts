import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_251": {
    "synonyms": ["regularly", "steadily", "constantly", "reliably"],
    "wordFamily": { "noun": ["consistency"], "adj": ["consistent"], "adv": ["consistently"] }
  },
  "w_b7_252": {
    "synonyms": ["strengthen", "unite", "combine", "secure"],
    "wordFamily": { "noun": ["consolidation"], "verb": ["consolidate"] }
  },
  "w_b7_253": {
    "synonyms": ["strengthening", "merger", "combination", "union"],
    "wordFamily": { "noun": ["consolidation"], "verb": ["consolidate"] }
  },
  "w_b7_254": {
    "synonyms": ["noticeable", "obvious", "clear", "visible"],
    "wordFamily": { "adj": ["conspicuous"], "adv": ["conspicuously"] }
  },
  "w_b7_255": {
    "synonyms": ["plot", "scheme", "collusion", "intrigue"],
    "wordFamily": { "noun": ["conspiracy", "conspirator"], "verb": ["conspire"] }
  },
  "w_b7_256": {
    "synonyms": ["continuous", "steady", "unending", "persistent"],
    "wordFamily": { "noun": ["constancy"], "adj": ["constant"], "adv": ["constantly"] }
  },
  "w_b7_257": {
    "synonyms": ["always", "continually", "perpetually", "endlessly"],
    "wordFamily": { "noun": ["constancy"], "adj": ["constant"], "adv": ["constantly"] }
  },
  "w_b7_258": {
    "synonyms": ["make up", "form", "compose", "comprise"],
    "wordFamily": { "noun": ["constitution"], "verb": ["constitute"] }
  },
  "w_b7_259": {
    "synonyms": ["legal", "statutory", "lawful", "structural"],
    "wordFamily": { "noun": ["constitution"], "adj": ["constitutional"], "adv": ["constitutionally"] }
  },
  "w_b7_260": {
    "synonyms": ["restriction", "limitation", "restraint", "control"],
    "wordFamily": { "noun": ["constraint"], "verb": ["constrain"], "adj": ["constrained"] }
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
console.log('Enriched w_b7_251 to w_b7_260');
