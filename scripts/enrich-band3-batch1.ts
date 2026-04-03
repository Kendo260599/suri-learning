import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_1": {
    "synonyms": ["maintainable", "viable", "eco-friendly"],
    "wordFamily": { "noun": ["sustainability"], "verb": ["sustain"], "adj": ["sustainable"], "adv": ["sustainably"] }
  },
  "w_b3_2": {
    "synonyms": ["contamination", "adulteration", "impurity"],
    "wordFamily": { "noun": ["pollution", "pollutant"], "verb": ["pollute"], "adj": ["polluted"] }
  },
  "w_b3_3": {
    "synonyms": ["well", "fit", "robust"],
    "wordFamily": { "noun": ["health"], "adj": ["healthy", "unhealthy"], "adv": ["healthily"] }
  },
  "w_b3_4": {
    "synonyms": ["machinery", "equipment", "automation"],
    "wordFamily": { "noun": ["technology", "technologist"], "adj": ["technological"], "adv": ["technologically"] }
  },
  "w_b3_5": {
    "synonyms": ["civilization", "society", "customs"],
    "wordFamily": { "noun": ["culture"], "verb": ["cultivate"], "adj": ["cultural"], "adv": ["culturally"] }
  },
  "w_b3_6": {
    "synonyms": ["invention", "modernization", "novelty"],
    "wordFamily": { "noun": ["innovation", "innovator"], "verb": ["innovate"], "adj": ["innovative"] }
  },
  "w_b3_7": {
    "synonyms": ["schooling", "teaching", "instruction"],
    "wordFamily": { "noun": ["education", "educator"], "verb": ["educate"], "adj": ["educational", "educated"], "adv": ["educationally"] }
  },
  "w_b3_8": {
    "synonyms": ["society", "neighborhood", "association"],
    "wordFamily": { "noun": ["community"], "adj": ["communal"], "adv": ["communally"] }
  },
  "w_b3_9": {
    "synonyms": ["community", "public", "civilization"],
    "wordFamily": { "noun": ["society", "socialization"], "verb": ["socialize"], "adj": ["social", "societal"], "adv": ["socially"] }
  },
  "w_b3_10": {
    "synonyms": ["administration", "regime", "authority"],
    "wordFamily": { "noun": ["government", "governor"], "verb": ["govern"], "adj": ["governmental"] }
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
console.log('Enrichment for Band 3 Batch 1 completed successfully.');
