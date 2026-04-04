import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_51": {
    "synonyms": ["rule", "law", "standard", "doctrine"],
    "wordFamily": { "noun": ["principle"], "adj": ["principled"] }
  },
  "w_b6_52": {
    "synonyms": ["idea", "notion", "theory", "abstraction"],
    "wordFamily": { "noun": ["concept", "conception", "conceptualization"], "verb": ["conceptualize"], "adj": ["conceptual"], "adv": ["conceptually"] }
  },
  "w_b6_53": {
    "synonyms": ["ideology", "worldview", "beliefs", "thought"],
    "wordFamily": { "noun": ["philosophy", "philosopher"], "verb": ["philosophize"], "adj": ["philosophical"], "adv": ["philosophically"] }
  },
  "w_b6_54": {
    "synonyms": ["morals", "morality", "values", "principles"],
    "wordFamily": { "noun": ["ethics", "ethicist"], "adj": ["ethical"], "adv": ["ethically"] }
  },
  "w_b6_55": {
    "synonyms": ["fairness", "parity", "uniformity", "equivalence"],
    "wordFamily": { "noun": ["equality", "inequality"], "verb": ["equalize"], "adj": ["equal"], "adv": ["equally"] }
  },
  "w_b6_56": {
    "synonyms": ["fairness", "equity", "rightfulness", "lawfulness"],
    "wordFamily": { "noun": ["justice", "injustice"], "verb": ["justify"], "adj": ["just", "justifiable"], "adv": ["justly", "justifiably"] }
  },
  "w_b6_57": {
    "synonyms": ["liberty", "independence", "autonomy", "release"],
    "wordFamily": { "noun": ["freedom"], "verb": ["free"], "adj": ["free"], "adv": ["freely"] }
  },
  "w_b6_58": {
    "synonyms": ["self-government", "republic", "autonomy"],
    "wordFamily": { "noun": ["democracy", "democrat", "democratization"], "verb": ["democratize"], "adj": ["democratic"], "adv": ["democratically"] }
  },
  "w_b6_59": {
    "synonyms": ["mankind", "human race", "compassion", "kindness"],
    "wordFamily": { "noun": ["humanity", "human", "humanism", "humanitarian"], "adj": ["human", "humane", "humanitarian"], "adv": ["humanly", "humanely"] }
  },
  "w_b6_60": {
    "synonyms": ["society", "culture", "advancement", "progress"],
    "wordFamily": { "noun": ["civilization", "civility"], "verb": ["civilize"], "adj": ["civilized", "civil"] }
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
console.log('Enriched w_b6_51 to w_b6_60');
