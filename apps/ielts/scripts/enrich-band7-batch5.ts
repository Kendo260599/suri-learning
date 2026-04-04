import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_41": {
    "synonyms": ["oratory", "eloquence", "expression", "diction"],
    "wordFamily": { "noun": ["rhetoric"], "adj": ["rhetorical"], "adv": ["rhetorically"] }
  },
  "w_b7_42": {
    "synonyms": ["reasoning", "rationale", "sense", "judgment"],
    "wordFamily": { "noun": ["logic", "logician"], "adj": ["logical"], "adv": ["logically"] }
  },
  "w_b7_43": {
    "synonyms": ["logic", "thinking", "deduction", "analysis"],
    "wordFamily": { "noun": ["reasoning", "reason"], "verb": ["reason"], "adj": ["reasonable"] }
  },
  "w_b7_44": {
    "synonyms": ["instinct", "insight", "hunch", "sixth sense"],
    "wordFamily": { "noun": ["intuition"], "adj": ["intuitive"], "adv": ["intuitively"] }
  },
  "w_b7_45": {
    "synonyms": ["theory of knowledge", "philosophy"],
    "wordFamily": { "noun": ["epistemology", "epistemologist"], "adj": ["epistemological"] }
  },
  "w_b7_46": {
    "synonyms": ["metaphysics", "philosophy of being"],
    "wordFamily": { "noun": ["ontology"], "adj": ["ontological"] }
  },
  "w_b7_47": {
    "synonyms": ["philosophy", "abstract thought", "epistemology"],
    "wordFamily": { "noun": ["metaphysics"], "adj": ["metaphysical"], "adv": ["metaphysically"] }
  },
  "w_b7_48": {
    "synonyms": ["philosophy of experience", "study of phenomena"],
    "wordFamily": { "noun": ["phenomenology", "phenomenologist"], "adj": ["phenomenological"] }
  },
  "w_b7_49": {
    "synonyms": ["philosophy of existence", "individualism"],
    "wordFamily": { "noun": ["existentialism", "existentialist"], "adj": ["existential"], "adv": ["existentially"] }
  },
  "w_b7_50": {
    "synonyms": ["cynicism", "skepticism", "pessimism", "negativity"],
    "wordFamily": { "noun": ["nihilism", "nihilist"], "adj": ["nihilistic"] }
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
console.log('Enriched w_b7_41 to w_b7_50');
