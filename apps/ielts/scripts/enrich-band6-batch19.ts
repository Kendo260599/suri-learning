import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_181": {
    "synonyms": ["monetary", "fiscal", "pecuniary", "economic"],
    "wordFamily": { "noun": ["finance", "financier"], "verb": ["finance"], "adj": ["financial"], "adv": ["financially"] }
  },
  "w_b6_182": {
    "synonyms": ["backer", "shareholder", "stakeholder", "financier"],
    "wordFamily": { "noun": ["investment", "investor"], "verb": ["invest"] }
  },
  "w_b6_183": {
    "synonyms": ["manufacturing", "technical", "business-related"],
    "wordFamily": { "noun": ["industry", "industrialist", "industrialization"], "verb": ["industrialize"], "adj": ["industrial", "industrious"], "adv": ["industrially", "industriously"] }
  },
  "w_b6_184": {
    "synonyms": ["manufacture", "creation", "output", "making"],
    "wordFamily": { "noun": ["production", "product", "producer", "productivity"], "verb": ["produce"], "adj": ["productive"], "adv": ["productively"] }
  },
  "w_b6_185": {
    "synonyms": ["item", "commodity", "good", "result"],
    "wordFamily": { "noun": ["product", "production", "producer", "productivity"], "verb": ["produce"], "adj": ["productive"] }
  },
  "w_b6_186": {
    "synonyms": ["assistance", "help", "utility", "maintenance"],
    "wordFamily": { "noun": ["service", "servant"], "verb": ["serve"], "adj": ["serviceable"] }
  },
  "w_b6_187": {
    "synonyms": ["segment", "area", "zone", "part"],
    "wordFamily": { "noun": ["sector"], "adj": ["sectoral"] }
  },
  "w_b6_188": {
    "synonyms": ["part", "section", "portion", "piece"],
    "wordFamily": { "noun": ["segment", "segmentation"], "verb": ["segment"] }
  },
  "w_b6_189": {
    "synonyms": ["portion", "part", "stock", "percentage"],
    "wordFamily": { "noun": ["share", "shareholder"], "verb": ["share"] }
  },
  "w_b6_190": {
    "synonyms": ["inventory", "supply", "shares", "equity"],
    "wordFamily": { "noun": ["stock", "stockist"], "verb": ["stock"] }
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
console.log('Enriched w_b6_181 to w_b6_190');
