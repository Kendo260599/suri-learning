import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_21": {
    "synonyms": ["connection", "association", "bond"],
    "wordFamily": { "noun": ["relationship", "relation", "relative"], "verb": ["relate"], "adj": ["related", "relative"], "adv": ["relatively"] }
  },
  "w_b3_22": {
    "synonyms": ["circumstance", "condition", "state"],
    "wordFamily": { "noun": ["situation"], "verb": ["situate"], "adj": ["situated", "situational"] }
  },
  "w_b3_23": {
    "synonyms": ["well-being", "fitness", "wellness"],
    "wordFamily": { "noun": ["health"], "adj": ["healthy", "unhealthy"], "adv": ["healthily"] }
  },
  "w_b3_24": {
    "synonyms": ["government", "public affairs", "diplomacy"],
    "wordFamily": { "noun": ["politics", "politician", "policy"], "verb": ["politicize"], "adj": ["political"], "adv": ["politically"] }
  },
  "w_b3_25": {
    "synonyms": ["interaction", "contact", "connection"],
    "wordFamily": { "noun": ["communication", "communicator"], "verb": ["communicate"], "adj": ["communicative"] }
  },
  "w_b3_26": {
    "synonyms": ["development", "advancement", "improvement"],
    "wordFamily": { "noun": ["progress", "progression"], "verb": ["progress"], "adj": ["progressive"], "adv": ["progressively"] }
  },
  "w_b3_27": {
    "synonyms": ["medication", "drug", "remedy"],
    "wordFamily": { "noun": ["medicine", "medication"], "verb": ["medicate"], "adj": ["medical", "medicinal"], "adv": ["medically"] }
  },
  "w_b3_28": {
    "synonyms": ["physician", "medic", "surgeon"],
    "wordFamily": { "noun": ["doctor", "doctorate"], "verb": ["doctor"], "adj": ["doctoral"] }
  },
  "w_b3_29": {
    "synonyms": ["caregiver", "medic", "matron"],
    "wordFamily": { "noun": ["nurse", "nursery", "nursing"], "verb": ["nurse"] }
  },
  "w_b3_30": {
    "synonyms": ["clinic", "infirmary", "medical center"],
    "wordFamily": { "noun": ["hospital", "hospitality", "hospitalization"], "verb": ["hospitalize"], "adj": ["hospitable"] }
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
console.log('Enrichment for Band 3 Batch 3 completed successfully.');
