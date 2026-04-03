import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_11": {
    "synonyms": ["rivalry", "competition", "ambition"],
    "wordFamily": { "noun": ["competitiveness", "competition", "competitor"], "verb": ["compete"], "adj": ["competitive"], "adv": ["competitively"] }
  },
  "w_b5_12": {
    "synonyms": ["viability", "yield", "gainfulness"],
    "wordFamily": { "noun": ["profitability", "profit"], "verb": ["profit"], "adj": ["profitable"], "adv": ["profitably"] }
  },
  "w_b5_13": {
    "synonyms": ["responsibility", "liability", "answerability"],
    "wordFamily": { "noun": ["accountability", "account", "accountant"], "verb": ["account"], "adj": ["accountable"] }
  },
  "w_b5_14": {
    "synonyms": ["clarity", "openness", "candor"],
    "wordFamily": { "noun": ["transparency"], "adj": ["transparent"], "adv": ["transparently"] }
  },
  "w_b5_15": {
    "synonyms": ["honesty", "probity", "rectitude"],
    "wordFamily": { "noun": ["integrity"] }
  },
  "w_b5_16": {
    "synonyms": ["inspiration", "incentive", "enthusiasm"],
    "wordFamily": { "noun": ["motivation", "motive", "motivator"], "verb": ["motivate"], "adj": ["motivational"] }
  },
  "w_b5_17": {
    "synonyms": ["dedication", "devotion", "allegiance"],
    "wordFamily": { "noun": ["commitment"], "verb": ["commit"], "adj": ["committed"] }
  },
  "w_b5_18": {
    "synonyms": ["star system", "constellation", "nebula"],
    "wordFamily": { "noun": ["galaxy"], "adj": ["galactic"] }
  },
  "w_b5_19": {
    "synonyms": ["celestial body", "world", "orb"],
    "wordFamily": { "noun": ["planet"], "adj": ["planetary"] }
  },
  "w_b5_20": {
    "synonyms": ["circuit", "revolution", "trajectory"],
    "wordFamily": { "noun": ["orbit"], "verb": ["orbit"], "adj": ["orbital"] }
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
    const lastPropertyMatch = /"topicId":\\s*"[^"]*"\s*(?=\n\s*})/.exec(entryBlock);
    
    if (lastPropertyMatch) {
      const insertIndex = lastPropertyMatch.index + lastPropertyMatch[0].length;
      const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
      
      const newEntryBlock = entryBlock.slice(0, insertIndex) + enrichmentStr + entryBlock.slice(insertIndex);
      content = content.replace(entryBlock, newEntryBlock);
    } else {
        // Fallback if the regex above fails due to formatting
        const topicIdIndex = entryBlock.lastIndexOf('"topicId":');
        if (topicIdIndex !== -1) {
            const closingBraceIndex = entryBlock.indexOf('}', topicIdIndex);
            if (closingBraceIndex !== -1) {
                const beforeBrace = entryBlock.substring(0, closingBraceIndex);
                const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
                const newEntryBlock = beforeBrace + enrichmentStr + entryBlock.substring(closingBraceIndex);
                content = content.replace(entryBlock, newEntryBlock);
            }
        }
    }
  }
}

fs.writeFileSync(filePath, content);
console.log('Enrichment for Band 5 Batch 2 completed successfully.');
