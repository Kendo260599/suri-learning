import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_1": {
    "synonyms": ["aggravate", "worsen", "compound", "intensify"],
    "wordFamily": { "noun": ["exacerbation"], "verb": ["exacerbate"] }
  },
  "w_b7_2": {
    "synonyms": ["reduce", "ease", "relieve", "mitigate"],
    "wordFamily": { "noun": ["alleviation"], "verb": ["alleviate"] }
  },
  "w_b7_3": {
    "synonyms": ["main", "chief", "principal", "dominant"],
    "wordFamily": { "noun": ["predominance"], "verb": ["predominate"], "adj": ["predominant"], "adv": ["predominantly"] }
  },
  "w_b7_4": {
    "synonyms": ["unavoidable", "inescapable", "certain", "sure"],
    "wordFamily": { "noun": ["inevitability"], "adj": ["inevitable"], "adv": ["inevitably"] }
  },
  "w_b7_5": {
    "synonyms": ["contradictory", "inconsistent", "illogical", "ironic"],
    "wordFamily": { "noun": ["paradox"], "adj": ["paradoxical"], "adv": ["paradoxically"] }
  },
  "w_b7_6": {
    "synonyms": ["compassionate", "understanding", "sympathetic", "sensitive"],
    "wordFamily": { "noun": ["empathy"], "verb": ["empathize"], "adj": ["empathetic"], "adv": ["empathetically"] }
  },
  "w_b7_7": {
    "synonyms": ["careful", "conscientious", "diligent", "scrupulous"],
    "wordFamily": { "noun": ["meticulousness"], "adj": ["meticulous"], "adv": ["meticulously"] }
  },
  "w_b7_8": {
    "synonyms": ["fluent", "articulate", "expressive", "persuasive"],
    "wordFamily": { "noun": ["eloquence"], "adj": ["eloquent"], "adv": ["eloquently"] }
  },
  "w_b7_9": {
    "synonyms": ["artistic", "beautiful", "tasteful", "visual"],
    "wordFamily": { "noun": ["aesthetic", "aesthetics"], "adj": ["aesthetic"], "adv": ["aesthetically"] }
  },
  "w_b7_10": {
    "synonyms": ["mental", "intellectual", "reasoning", "thinking"],
    "wordFamily": { "noun": ["cognition"], "adj": ["cognitive"], "adv": ["cognitively"] }
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
console.log('Enriched w_b7_1 to w_b7_10');
