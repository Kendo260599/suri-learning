import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_11": {
    "synonyms": ["fleeting", "short-lived", "transient", "momentary"],
    "wordFamily": { "noun": ["ephemera"], "adj": ["ephemeral"], "adv": ["ephemerally"] }
  },
  "w_b6_12": {
    "synonyms": ["omnipresent", "pervasive", "ever-present"],
    "wordFamily": { "noun": ["ubiquity"], "adj": ["ubiquitous"], "adv": ["ubiquitously"] }
  },
  "w_b6_13": {
    "synonyms": ["practical", "realistic", "sensible"],
    "wordFamily": { "noun": ["pragmatism", "pragmatist"], "adj": ["pragmatic"], "adv": ["pragmatically"] }
  },
  "w_b6_14": {
    "synonyms": ["opinionated", "assertive", "inflexible"],
    "wordFamily": { "noun": ["dogma", "dogmatism"], "adj": ["dogmatic"], "adv": ["dogmatically"] }
  },
  "w_b6_15": {
    "synonyms": ["unselfish", "selfless", "philanthropic"],
    "wordFamily": { "noun": ["altruism", "altruist"], "adj": ["altruistic"], "adv": ["altruistically"] }
  },
  "w_b6_16": {
    "synonyms": ["self-indulgent", "pleasure-seeking"],
    "wordFamily": { "noun": ["hedonism", "hedonist"], "adj": ["hedonistic"], "adv": ["hedonistically"] }
  },
  "w_b6_17": {
    "synonyms": ["impassive", "unemotional", "phlegmatic"],
    "wordFamily": { "noun": ["stoicism", "stoic"], "adj": ["stoic", "stoical"], "adv": ["stoically"] }
  },
  "w_b6_18": {
    "synonyms": ["skeptical", "distrustful", "pessimistic"],
    "wordFamily": { "noun": ["cynic", "cynicism"], "adj": ["cynical"], "adv": ["cynically"] }
  },
  "w_b6_19": {
    "synonyms": ["doubtful", "dubious", "unbelieving"],
    "wordFamily": { "noun": ["skeptic", "skepticism"], "adj": ["skeptical"], "adv": ["skeptically"] }
  },
  "w_b6_20": {
    "synonyms": ["hopeful", "positive", "confident"],
    "wordFamily": { "noun": ["optimism", "optimist"], "adj": ["optimistic"], "adv": ["optimistically"] }
  }
};

for (const [id, data] of Object.entries(enrichments)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
  const replacement = `$1,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
  
  if (content.includes(`"id": "${id}"`) && !content.includes(`"id": "${id}"` + '[\s\S]*?"synonyms":')) {
      content = content.replace(regex, replacement);
  }
}

fs.writeFileSync(vocabPath, content);
console.log('Enriched w_b6_11 to w_b6_20');
