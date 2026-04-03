import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_61": {
    "synonyms": ["therapist", "analyst", "shrink"],
    "wordFamily": { "noun": ["psychiatrist", "psychiatry"], "adj": ["psychiatric"] }
  },
  "w_b3_62": {
    "synonyms": ["prediction", "forecast", "projection"],
    "wordFamily": { "noun": ["prognosis"], "verb": ["prognosticate"], "adj": ["prognostic"] }
  },
  "w_b3_63": {
    "synonyms": ["condition", "disorder", "disease"],
    "wordFamily": { "noun": ["syndrome"] }
  },
  "w_b3_64": {
    "synonyms": ["swelling", "redness", "irritation"],
    "wordFamily": { "noun": ["inflammation"], "verb": ["inflame"], "adj": ["inflammatory", "inflamed"] }
  },
  "w_b3_65": {
    "synonyms": ["immunization", "inoculation", "shot"],
    "wordFamily": { "noun": ["vaccination", "vaccine"], "verb": ["vaccinate"] }
  },
  "w_b3_66": {
    "synonyms": ["vaccination", "immunization", "injection"],
    "wordFamily": { "noun": ["inoculation"], "verb": ["inoculate"] }
  },
  "w_b3_67": {
    "synonyms": ["medicine", "drug", "penicillin"],
    "wordFamily": { "noun": ["antibiotic"] }
  },
  "w_b3_68": {
    "synonyms": ["advice", "guidance", "therapy"],
    "wordFamily": { "noun": ["counseling", "counselor", "counsel"], "verb": ["counsel"] }
  },
  "w_b3_69": {
    "synonyms": ["adviser", "guide", "therapist"],
    "wordFamily": { "noun": ["counselor", "counseling", "counsel"], "verb": ["counsel"] }
  },
  "w_b3_70": {
    "synonyms": ["psychology", "therapy"],
    "wordFamily": { "noun": ["psychiatry", "psychiatrist"], "adj": ["psychiatric"] }
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
console.log('Enrichment for Band 3 Batch 7 completed successfully.');
