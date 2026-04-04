import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_231": {
    "synonyms": ["expert", "authority", "specialist", "pundit"],
    "wordFamily": { "noun": ["connoisseur"] }
  },
  "w_b7_232": {
    "synonyms": ["implication", "hidden meaning", "undertone", "association"],
    "wordFamily": { "noun": ["connotation"], "verb": ["connote"] }
  },
  "w_b7_233": {
    "synonyms": ["imply", "suggest", "indicate", "signify"],
    "wordFamily": { "noun": ["connotation"], "verb": ["connote"] }
  },
  "w_b7_234": {
    "synonyms": ["marital", "conjugal", "matrimonial", "nuptial"],
    "wordFamily": { "adj": ["connubial"] }
  },
  "w_b7_235": {
    "synonyms": ["defeat", "beat", "vanquish", "overcome"],
    "wordFamily": { "noun": ["conquest", "conqueror"], "verb": ["conquer"] }
  },
  "w_b7_236": {
    "synonyms": ["defeat", "victory", "triumph", "subjugation"],
    "wordFamily": { "noun": ["conquest", "conqueror"], "verb": ["conquer"] }
  },
  "w_b7_237": {
    "synonyms": ["related", "kin", "kindred"],
    "wordFamily": { "noun": ["consanguinity"], "adj": ["consanguineous"] }
  },
  "w_b7_238": {
    "synonyms": ["diligent", "careful", "meticulous", "dedicated"],
    "wordFamily": { "noun": ["conscientiousness"], "adj": ["conscientious"], "adv": ["conscientiously"] }
  },
  "w_b7_239": {
    "synonyms": ["aware", "awake", "alert", "mindful"],
    "wordFamily": { "noun": ["consciousness"], "adj": ["conscious"], "adv": ["consciously"] }
  },
  "w_b7_240": {
    "synonyms": ["awareness", "wakefulness", "alertness", "mindfulness"],
    "wordFamily": { "noun": ["consciousness"], "adj": ["conscious"], "adv": ["consciously"] }
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
console.log('Enriched w_b7_231 to w_b7_240');
