import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichment = [
  {
    id: "w_b4_121",
    synonyms: ["differentiate", "distinguish", "segregate"],
    wordFamily: { noun: ["discrimination"], verb: ["discriminate"], adj: ["discriminatory"], adv: ["discriminately"] }
  },
  {
    id: "w_b4_122",
    synonyms: ["exhibit", "show", "manifest"],
    wordFamily: { noun: ["display"], verb: ["display"] }
  },
  {
    id: "w_b4_123",
    synonyms: ["varied", "various", "assorted"],
    wordFamily: { noun: ["diversity"], verb: ["diversify"], adj: ["diverse"], adv: ["diversely"] }
  },
  {
    id: "w_b4_124",
    synonyms: ["result", "consequence", "effect"],
    wordFamily: { noun: ["outcome"] }
  },
  {
    id: "w_b4_125",
    synonyms: ["equivalent", "analogous", "corresponding"],
    wordFamily: { noun: ["parallel"], verb: ["parallel"], adj: ["parallel"] }
  },
  {
    id: "w_b4_126",
    synonyms: ["limit", "boundary", "criterion"],
    wordFamily: { noun: ["parameter"], adj: ["parametric"] }
  },
  {
    id: "w_b4_127",
    synonyms: ["stage", "period", "step"],
    wordFamily: { noun: ["phase"], verb: ["phase"] }
  },
  {
    id: "w_b4_128",
    synonyms: ["forecast", "foresee", "anticipate"],
    wordFamily: { noun: ["prediction", "predictability"], verb: ["predict"], adj: ["predictable"], adv: ["predictably"] }
  },
  {
    id: "w_b4_129",
    synonyms: ["main", "chief", "primary"],
    wordFamily: { noun: ["principal"], adj: ["principal"], adv: ["principally"] }
  },
  {
    id: "w_b4_130",
    synonyms: ["previous", "preceding", "former"],
    wordFamily: { adj: ["prior"] }
  }
];

enrichment.forEach(item => {
  const regex = new RegExp(`("id":\\s*"${item.id}",[\\s\\S]*?"topicId":\\s*".*?")`, 'g');
  const replacement = `$1,\n    "synonyms": ${JSON.stringify(item.synonyms)},\n    "wordFamily": ${JSON.stringify(item.wordFamily)}`;
  content = content.replace(regex, replacement);
});

fs.writeFileSync(vocabPath, content);
console.log('Enriched Band 4 Batch 14 (IDs 121-130)');
