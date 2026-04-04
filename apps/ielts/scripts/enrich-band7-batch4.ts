import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_31": {
    "synonyms": ["steadiness", "reliability", "uniformity", "constancy"],
    "wordFamily": { "noun": ["consistency"], "adj": ["consistent"], "adv": ["consistently"] }
  },
  "w_b7_32": {
    "synonyms": ["conflict", "discrepancy", "inconsistency", "opposition"],
    "wordFamily": { "noun": ["contradiction"], "verb": ["contradict"], "adj": ["contradictory"] }
  },
  "w_b7_33": {
    "synonyms": ["contradiction", "anomaly", "enigma", "puzzle"],
    "wordFamily": { "noun": ["paradox"], "adj": ["paradoxical"], "adv": ["paradoxically"] }
  },
  "w_b7_34": {
    "synonyms": ["predicament", "quandary", "problem", "difficulty"],
    "wordFamily": { "noun": ["dilemma"] }
  },
  "w_b7_35": {
    "synonyms": ["importance", "meaning", "relevance", "consequence"],
    "wordFamily": { "noun": ["significance"], "verb": ["signify"], "adj": ["significant"], "adv": ["significantly"] }
  },
  "w_b7_36": {
    "synonyms": ["donation", "input", "addition", "grant"],
    "wordFamily": { "noun": ["contribution", "contributor"], "verb": ["contribute"], "adj": ["contributory"] }
  },
  "w_b7_37": {
    "synonyms": ["accomplishment", "success", "attainment", "feat"],
    "wordFamily": { "noun": ["achievement", "achiever"], "verb": ["achieve"], "adj": ["achievable"] }
  },
  "w_b7_38": {
    "synonyms": ["nuance", "delicacy", "refinement", "intricacy"],
    "wordFamily": { "noun": ["subtlety"], "adj": ["subtle"], "adv": ["subtly"] }
  },
  "w_b7_39": {
    "synonyms": ["ethics", "virtue", "goodness", "righteousness"],
    "wordFamily": { "noun": ["morality", "moral"], "verb": ["moralize"], "adj": ["moral"], "adv": ["morally"] }
  },
  "w_b7_40": {
    "synonyms": ["artistry", "beauty", "taste", "style"],
    "wordFamily": { "noun": ["aesthetics", "aesthetic"], "adj": ["aesthetic"], "adv": ["aesthetically"] }
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
console.log('Enriched w_b7_31 to w_b7_40');
