import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_41": {
    "synonyms": ["deterrence", "avoidance", "precaution"],
    "wordFamily": { "noun": ["prevention"], "verb": ["prevent"], "adj": ["preventive", "preventable"] }
  },
  "w_b3_42": {
    "synonyms": ["remedy", "treatment", "healing"],
    "wordFamily": { "noun": ["cure"], "verb": ["cure"], "adj": ["curable", "incurable"] }
  },
  "w_b3_43": {
    "synonyms": ["treatment", "remedy", "healing"],
    "wordFamily": { "noun": ["therapy", "therapist"], "adj": ["therapeutic"], "adv": ["therapeutically"] }
  },
  "w_b3_44": {
    "synonyms": ["immunization", "inoculation", "shot"],
    "wordFamily": { "noun": ["vaccine", "vaccination"], "verb": ["vaccinate"] }
  },
  "w_b3_45": {
    "synonyms": ["resistance", "protection", "defense"],
    "wordFamily": { "noun": ["immunity", "immunization"], "verb": ["immunize"], "adj": ["immune"] }
  },
  "w_b3_46": {
    "synonyms": ["disease", "virus", "contagion"],
    "wordFamily": { "noun": ["infection"], "verb": ["infect"], "adj": ["infectious", "infected"] }
  },
  "w_b3_47": {
    "synonyms": ["temperature", "heat", "delirium"],
    "wordFamily": { "noun": ["fever"], "adj": ["feverish"], "adv": ["feverishly"] }
  },
  "w_b3_48": {
    "synonyms": ["hack", "bark", "clear throat"],
    "wordFamily": { "noun": ["cough"], "verb": ["cough"] }
  },
  "w_b3_49": {
    "synonyms": ["migraine", "head pain", "neuralgia"],
    "wordFamily": { "noun": ["headache"] }
  },
  "w_b3_50": {
    "synonyms": ["instruction", "direction", "recipe"],
    "wordFamily": { "noun": ["prescription"], "verb": ["prescribe"], "adj": ["prescriptive"] }
  }
};

let content = fs.readFileSync(filePath, 'utf8');

for (const [id, data] of Object.entries(enrichmentData)) {
  const idPattern = new RegExp(`"id":\\s*"${id}"`, 'g');
  const match = idPattern.exec(content);
  
  if (match) {
    const startIndex = match.index;
    const nextIdMatch = /"id":\s*"w_/.exec(content.substring(startIndex + 1));
    const endIndex = nextIdMatch ? startIndex + 1 + nextIdMatch.index : content.length;
    
    let entryBlock = content.substring(startIndex, endIndex);
    
    // Find the last property before the closing brace of the object
    const lastPropertyMatch = /"topicId":\s*"[^"]*"\s*(?=\n\s*})/.exec(entryBlock);
    
    if (lastPropertyMatch) {
      const insertIndex = lastPropertyMatch.index + lastPropertyMatch[0].length;
      const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
      
      const newEntryBlock = entryBlock.slice(0, insertIndex) + enrichmentStr + entryBlock.slice(insertIndex);
      content = content.replace(entryBlock, newEntryBlock);
    }
  }
}

fs.writeFileSync(filePath, content);
console.log('Enrichment for Band 3 Batch 5 completed successfully.');
