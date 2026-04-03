import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_71": {
    "synonyms": ["mind science", "behavioral science"],
    "wordFamily": { "noun": ["psychology", "psychologist"], "adj": ["psychological"], "adv": ["psychologically"] }
  },
  "w_b3_72": {
    "synonyms": ["neuroscience", "brain science"],
    "wordFamily": { "noun": ["neurology", "neurologist"], "adj": ["neurological"], "adv": ["neurologically"] }
  },
  "w_b3_73": {
    "synonyms": ["brain specialist", "nerve specialist"],
    "wordFamily": { "noun": ["neurologist", "neurology"], "adj": ["neurological"], "adv": ["neurologically"] }
  },
  "w_b3_74": {
    "synonyms": ["numbness", "pain relief", "sedation"],
    "wordFamily": { "noun": ["anesthesia", "anesthetic", "anesthetist"], "verb": ["anesthetize"], "adj": ["anesthetic"] }
  },
  "w_b3_75": {
    "synonyms": ["anesthesiologist", "sedationist"],
    "wordFamily": { "noun": ["anesthetist", "anesthesia", "anesthetic"], "verb": ["anesthetize"] }
  },
  "w_b3_76": {
    "synonyms": ["drugstore", "chemist", "dispensary"],
    "wordFamily": { "noun": ["pharmacy", "pharmacist", "pharmaceuticals"], "adj": ["pharmaceutical"] }
  },
  "w_b3_77": {
    "synonyms": ["recovery", "restoration", "therapy"],
    "wordFamily": { "noun": ["rehabilitation", "rehab"], "verb": ["rehabilitate"], "adj": ["rehabilitative"] }
  },
  "w_b3_78": {
    "synonyms": ["medicine", "drug", "prescription"],
    "wordFamily": { "noun": ["medication", "medicine"], "verb": ["medicate"], "adj": ["medical", "medicinal"], "adv": ["medically"] }
  },
  "w_b3_79": {
    "synonyms": ["crisis", "urgency", "exigency"],
    "wordFamily": { "noun": ["emergency", "emergence"], "verb": ["emerge"], "adj": ["emergent"] }
  },
  "w_b3_80": {
    "synonyms": ["rescue vehicle", "medic unit"],
    "wordFamily": { "noun": ["ambulance"] }
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
console.log('Enrichment for Band 3 Batch 8 completed successfully.');
