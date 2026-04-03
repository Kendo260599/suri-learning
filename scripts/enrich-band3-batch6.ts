import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_51": {
    "synonyms": ["health center", "infirmary", "surgery"],
    "wordFamily": { "noun": ["clinic", "clinician"], "adj": ["clinical"], "adv": ["clinically"] }
  },
  "w_b3_52": {
    "synonyms": ["room", "department", "unit"],
    "wordFamily": { "noun": ["ward"] }
  },
  "w_b3_53": {
    "synonyms": ["doctor", "medical practitioner", "medic"],
    "wordFamily": { "noun": ["physician"] }
  },
  "w_b3_54": {
    "synonyms": ["doctor", "specialist", "operator"],
    "wordFamily": { "noun": ["surgeon", "surgery"], "adj": ["surgical"], "adv": ["surgically"] }
  },
  "w_b3_55": {
    "synonyms": ["expert", "authority", "professional"],
    "wordFamily": { "noun": ["specialist", "specialty", "specialization"], "verb": ["specialize"], "adj": ["specialized"] }
  },
  "w_b3_56": {
    "synonyms": ["counselor", "healer", "psychotherapist"],
    "wordFamily": { "noun": ["therapist", "therapy"], "adj": ["therapeutic"], "adv": ["therapeutically"] }
  },
  "w_b3_57": {
    "synonyms": ["chemist", "apothecary", "druggist"],
    "wordFamily": { "noun": ["pharmacist", "pharmacy", "pharmaceuticals"], "adj": ["pharmaceutical"] }
  },
  "w_b3_58": {
    "synonyms": ["dental surgeon", "orthodontist"],
    "wordFamily": { "noun": ["dentist", "dentistry"], "adj": ["dental"] }
  },
  "w_b3_59": {
    "synonyms": ["optometrist", "eye doctor"],
    "wordFamily": { "noun": ["optician", "optics"], "adj": ["optical"], "adv": ["optically"] }
  },
  "w_b3_60": {
    "synonyms": ["analyst", "therapist", "counselor"],
    "wordFamily": { "noun": ["psychologist", "psychology"], "adj": ["psychological"], "adv": ["psychologically"] }
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
console.log('Enrichment for Band 3 Batch 6 completed successfully.');
