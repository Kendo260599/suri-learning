import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_181": {
    "synonyms": ["mandatory", "obligatory", "required", "essential"],
    "wordFamily": { "noun": ["compulsion"], "verb": ["compel"], "adj": ["compulsory", "compulsive"], "adv": ["compulsorily"] }
  },
  "w_b7_182": {
    "synonyms": ["calculate", "reckon", "figure", "evaluate"],
    "wordFamily": { "noun": ["computation", "computer"], "verb": ["compute"] }
  },
  "w_b7_183": {
    "synonyms": ["hide", "cover", "mask", "disguise"],
    "wordFamily": { "noun": ["concealment"], "verb": ["conceal"] }
  },
  "w_b7_184": {
    "synonyms": ["admit", "acknowledge", "accept", "yield"],
    "wordFamily": { "noun": ["concession"], "verb": ["concede"] }
  },
  "w_b7_185": {
    "synonyms": ["focus", "center", "gather", "collect"],
    "wordFamily": { "noun": ["concentration"], "verb": ["concentrate"], "adj": ["concentrated"] }
  },
  "w_b7_186": {
    "synonyms": ["focus", "attention", "gathering", "collection"],
    "wordFamily": { "noun": ["concentration"], "verb": ["concentrate"], "adj": ["concentrated"] }
  },
  "w_b7_187": {
    "synonyms": ["idea", "notion", "concept", "understanding"],
    "wordFamily": { "noun": ["conception", "concept"], "verb": ["conceive"], "adj": ["conceptual"] }
  },
  "w_b7_188": {
    "synonyms": ["worry", "anxiety", "matter", "interest"],
    "wordFamily": { "noun": ["concern"], "verb": ["concern"], "adj": ["concerned", "concerning"] }
  },
  "w_b7_189": {
    "synonyms": ["performance", "show", "gig", "recital"],
    "wordFamily": { "noun": ["concert"] }
  },
  "w_b7_190": {
    "synonyms": ["compromise", "allowance", "yielding", "grant"],
    "wordFamily": { "noun": ["concession"], "verb": ["concede"] }
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
console.log('Enriched w_b7_181 to w_b7_190');
