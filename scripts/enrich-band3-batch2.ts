import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_11": {
    "synonyms": ["wealth", "financial system", "finances"],
    "wordFamily": { "noun": ["economy", "economics", "economist"], "verb": ["economize"], "adj": ["economic", "economical"], "adv": ["economically"] }
  },
  "w_b3_12": {
    "synonyms": ["business", "trade", "manufacturing"],
    "wordFamily": { "noun": ["industry", "industrialist"], "verb": ["industrialize"], "adj": ["industrial", "industrious"], "adv": ["industrially", "industriously"] }
  },
  "w_b3_13": {
    "synonyms": ["asset", "supply", "reserve"],
    "wordFamily": { "noun": ["resource", "resourcefulness"], "adj": ["resourceful"], "adv": ["resourcefully"] }
  },
  "w_b3_14": {
    "synonyms": ["weather", "atmosphere", "environment"],
    "wordFamily": { "noun": ["climate", "climatology"], "adj": ["climatic"] }
  },
  "w_b3_15": {
    "synonyms": ["environment", "earth", "world"],
    "wordFamily": { "noun": ["nature", "naturalist"], "adj": ["natural"], "adv": ["naturally"] }
  },
  "w_b3_16": {
    "synonyms": ["kind", "type", "breed"],
    "wordFamily": { "noun": ["species"] }
  },
  "w_b3_17": {
    "synonyms": ["growth", "evolution", "progress"],
    "wordFamily": { "noun": ["development", "developer"], "verb": ["develop"], "adj": ["developmental", "developing", "developed"], "adv": ["developmentally"] }
  },
  "w_b3_18": {
    "synonyms": ["execution", "presentation", "show"],
    "wordFamily": { "noun": ["performance", "performer"], "verb": ["perform"] }
  },
  "w_b3_19": {
    "synonyms": ["chance", "likelihood", "probability"],
    "wordFamily": { "noun": ["possibility"], "adj": ["possible"], "adv": ["possibly"] }
  },
  "w_b3_20": {
    "synonyms": ["readiness", "arrangement", "planning"],
    "wordFamily": { "noun": ["preparation", "preparedness"], "verb": ["prepare"], "adj": ["prepared", "preparatory"] }
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
console.log('Enrichment for Band 3 Batch 2 completed successfully.');
