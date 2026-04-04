import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_21": {
    "synonyms": ["comprehensive", "integrated", "complete", "whole"],
    "wordFamily": { "noun": ["holism"], "adj": ["holistic"], "adv": ["holistically"] }
  },
  "w_b7_22": {
    "synonyms": ["subtlety", "distinction", "shade", "refinement"],
    "wordFamily": { "noun": ["nuance"], "adj": ["nuanced"] }
  },
  "w_b7_23": {
    "synonyms": ["aspect", "feature", "side", "dimension"],
    "wordFamily": { "noun": ["facet"], "adj": ["faceted"] }
  },
  "w_b7_24": {
    "synonyms": ["aspect", "element", "feature", "proportion"],
    "wordFamily": { "noun": ["dimension"], "adj": ["dimensional"] }
  },
  "w_b7_25": {
    "synonyms": ["circumstances", "situation", "background", "setting"],
    "wordFamily": { "noun": ["context"], "verb": ["contextualize"], "adj": ["contextual"], "adv": ["contextually"] }
  },
  "w_b7_26": {
    "synonyms": ["complication", "intricacy", "difficulty", "elaboration"],
    "wordFamily": { "noun": ["complexity", "complex"], "verb": ["complicate"], "adj": ["complex"] }
  },
  "w_b7_27": {
    "synonyms": ["clarity", "plainness", "easiness", "straightforwardness"],
    "wordFamily": { "noun": ["simplicity", "simplification"], "verb": ["simplify"], "adj": ["simple"], "adv": ["simply"] }
  },
  "w_b7_28": {
    "synonyms": ["vagueness", "uncertainty", "obscurity", "equivocation"],
    "wordFamily": { "noun": ["ambiguity"], "adj": ["ambiguous"], "adv": ["ambiguously"] }
  },
  "w_b7_29": {
    "synonyms": ["lucidity", "clearness", "transparency", "simplicity"],
    "wordFamily": { "noun": ["clarity", "clarification"], "verb": ["clarify"], "adj": ["clear"], "adv": ["clearly"] }
  },
  "w_b7_30": {
    "synonyms": ["consistency", "logic", "rationality", "soundness"],
    "wordFamily": { "noun": ["coherence"], "verb": ["cohere"], "adj": ["coherent"], "adv": ["coherently"] }
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
console.log('Enriched w_b7_21 to w_b7_30');
