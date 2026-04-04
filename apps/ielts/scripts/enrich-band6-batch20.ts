import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_191": {
    "synonyms": ["financial", "monetary", "budgetary", "economic"],
    "wordFamily": { "noun": ["fiscal"], "adv": ["fiscally"] }
  },
  "w_b6_192": {
    "synonyms": ["financial", "fiscal", "pecuniary", "cash"],
    "wordFamily": { "noun": ["money", "monetarism"], "adj": ["monetary"], "adv": ["monetarily"] }
  },
  "w_b6_193": {
    "synonyms": ["speed", "pace", "measure", "price"],
    "wordFamily": { "noun": ["rate", "rating"], "verb": ["rate"] }
  },
  "w_b6_194": {
    "synonyms": ["equilibrium", "stability", "remainder", "rest"],
    "wordFamily": { "noun": ["balance"], "verb": ["balance"], "adj": ["balanced"] }
  },
  "w_b6_195": {
    "synonyms": ["label", "mark", "type", "kind"],
    "wordFamily": { "noun": ["brand", "branding"], "verb": ["brand"] }
  },
  "w_b6_196": {
    "synonyms": ["marketing", "promotion", "advertising"],
    "wordFamily": { "noun": ["branding", "brand"], "verb": ["brand"] }
  },
  "w_b6_197": {
    "synonyms": ["client", "buyer", "patron", "shopper"],
    "wordFamily": { "noun": ["customer", "custom"], "verb": ["customize"], "adj": ["customary"] }
  },
  "w_b6_198": {
    "synonyms": ["user", "buyer", "customer", "shopper"],
    "wordFamily": { "noun": ["consumer", "consumption", "consumerism"], "verb": ["consume"], "adj": ["consumable"] }
  },
  "w_b6_199": {
    "synonyms": ["customer", "patron", "buyer", "user"],
    "wordFamily": { "noun": ["client", "clientele"] }
  },
  "w_b6_200": {
    "synonyms": ["buy", "acquire", "obtain", "acquisition"],
    "wordFamily": { "noun": ["purchase", "purchaser"], "verb": ["purchase"] }
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
console.log('Enriched w_b6_191 to w_b6_200');
