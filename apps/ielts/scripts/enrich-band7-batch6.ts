import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_51": {
    "synonyms": ["practicality", "realism", "common sense", "matter-of-factness"],
    "wordFamily": { "noun": ["pragmatism", "pragmatist"], "adj": ["pragmatic"], "adv": ["pragmatically"] }
  },
  "w_b7_52": {
    "synonyms": ["observation", "experience", "experimentation"],
    "wordFamily": { "noun": ["empiricism", "empiricist"], "adj": ["empirical"], "adv": ["empirically"] }
  },
  "w_b7_53": {
    "synonyms": ["logic", "reason", "intellectualism"],
    "wordFamily": { "noun": ["rationalism", "rationalist"], "adj": ["rationalistic"] }
  },
  "w_b7_54": {
    "synonyms": ["perfectionism", "utopianism", "romanticism", "optimism"],
    "wordFamily": { "noun": ["idealism", "idealist"], "verb": ["idealize"], "adj": ["idealistic"], "adv": ["idealistically"] }
  },
  "w_b7_55": {
    "synonyms": ["selflessness", "philanthropy", "compassion", "humanitarianism"],
    "wordFamily": { "noun": ["altruism", "altruist"], "adj": ["altruistic"], "adv": ["altruistically"] }
  },
  "w_b7_56": {
    "synonyms": ["selfishness", "self-interest", "egocentrism", "narcissism"],
    "wordFamily": { "noun": ["egoism", "egoist"], "adj": ["egoistic", "egoistical"], "adv": ["egoistically"] }
  },
  "w_b7_57": {
    "synonyms": ["pleasure-seeking", "indulgence", "sensuality", "decadence"],
    "wordFamily": { "noun": ["hedonism", "hedonist"], "adj": ["hedonistic"] }
  },
  "w_b7_58": {
    "synonyms": ["endurance", "fortitude", "patience", "resilience"],
    "wordFamily": { "noun": ["stoicism", "stoic"], "adj": ["stoic", "stoical"], "adv": ["stoically"] }
  },
  "w_b7_59": {
    "synonyms": ["austerity", "self-denial", "abstinence", "frugality"],
    "wordFamily": { "noun": ["asceticism", "ascetic"], "adj": ["ascetic"] }
  },
  "w_b7_60": {
    "synonyms": ["inflexibility", "rigidity", "intolerance", "narrow-mindedness"],
    "wordFamily": { "noun": ["dogmatism", "dogma", "dogmatist"], "adj": ["dogmatic"], "adv": ["dogmatically"] }
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
console.log('Enriched w_b7_51 to w_b7_60');
