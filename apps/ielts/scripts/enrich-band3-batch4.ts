import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_31": {
    "synonyms": ["sufferer", "invalid", "case"],
    "wordFamily": { "noun": ["patient", "patience"], "adj": ["patient"], "adv": ["patiently"] }
  },
  "w_b3_32": {
    "synonyms": ["ache", "soreness", "discomfort"],
    "wordFamily": { "noun": ["pain"], "verb": ["pain"], "adj": ["painful", "painless"], "adv": ["painfully", "painlessly"] }
  },
  "w_b3_33": {
    "synonyms": ["sickness", "disease", "ailment"],
    "wordFamily": { "noun": ["illness"], "adj": ["ill"] }
  },
  "w_b3_34": {
    "synonyms": ["illness", "sickness", "condition"],
    "wordFamily": { "noun": ["disease"], "adj": ["diseased"] }
  },
  "w_b3_35": {
    "synonyms": ["wound", "damage", "harm"],
    "wordFamily": { "noun": ["injury"], "verb": ["injure"], "adj": ["injured", "injurious"], "adv": ["injuriously"] }
  },
  "w_b3_36": {
    "synonyms": ["therapy", "care", "remedy"],
    "wordFamily": { "noun": ["treatment"], "verb": ["treat"], "adj": ["treatable"] }
  },
  "w_b3_37": {
    "synonyms": ["operation", "procedure"],
    "wordFamily": { "noun": ["surgery", "surgeon"], "adj": ["surgical"], "adv": ["surgically"] }
  },
  "w_b3_38": {
    "synonyms": ["recuperation", "healing", "improvement"],
    "wordFamily": { "noun": ["recovery"], "verb": ["recover"], "adj": ["recoverable"] }
  },
  "w_b3_39": {
    "synonyms": ["sign", "indication", "manifestation"],
    "wordFamily": { "noun": ["symptom"], "adj": ["symptomatic"], "adv": ["symptomatically"] }
  },
  "w_b3_40": {
    "synonyms": ["identification", "detection", "recognition"],
    "wordFamily": { "noun": ["diagnosis"], "verb": ["diagnose"], "adj": ["diagnostic"] }
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
console.log('Enrichment for Band 3 Batch 4 completed successfully.');
