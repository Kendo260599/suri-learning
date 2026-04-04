import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_161": {
    "synonyms": ["supporter", "proponent", "defender", "champion"],
    "wordFamily": { "noun": ["advocate", "advocacy"], "verb": ["advocate"] }
  },
  "w_b6_162": {
    "synonyms": ["influence", "impact", "change", "alter"],
    "wordFamily": { "noun": ["effect", "affection"], "verb": ["affect"], "adj": ["affecting", "affected"] }
  },
  "w_b6_163": {
    "synonyms": ["help", "assistance", "support", "relief"],
    "wordFamily": { "noun": ["aid", "aide"], "verb": ["aid"] }
  },
  "w_b6_164": {
    "synonyms": ["although", "even though", "even if", "notwithstanding"],
    "wordFamily": { "conj": ["albeit"] }
  },
  "w_b6_165": {
    "synonyms": ["change", "modify", "adjust", "amend"],
    "wordFamily": { "noun": ["alteration"], "verb": ["alter"], "adj": ["alterable"] }
  },
  "w_b6_166": {
    "synonyms": ["graph", "diagram", "table", "map"],
    "wordFamily": { "noun": ["chart"], "verb": ["chart"] }
  },
  "w_b6_167": {
    "synonyms": ["substance", "compound", "element"],
    "wordFamily": { "noun": ["chemical", "chemistry", "chemist"], "adj": ["chemical"], "adv": ["chemically"] }
  },
  "w_b6_168": {
    "synonyms": ["situation", "condition", "context", "state"],
    "wordFamily": { "noun": ["circumstance"], "adj": ["circumstantial"] }
  },
  "w_b6_169": {
    "synonyms": ["polite", "courteous", "civic", "public"],
    "wordFamily": { "noun": ["civility", "civilian", "civilization"], "adj": ["civil", "civilized"], "adv": ["civilly"] }
  },
  "w_b6_170": {
    "synonyms": ["typical", "traditional", "standard", "exemplary"],
    "wordFamily": { "noun": ["classic", "classicism"], "adj": ["classic", "classical"], "adv": ["classically"] }
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
console.log('Enriched w_b6_161 to w_b6_170');
