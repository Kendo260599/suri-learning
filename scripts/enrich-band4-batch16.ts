import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_151": {
    "synonyms": ["breach", "infringement", "contravention"],
    "wordFamily": { "noun": ["violation", "violator"], "verb": ["violate"] }
  },
  "w_b4_152": {
    "synonyms": ["simulated", "digital", "near"],
    "wordFamily": { "adj": ["virtual"], "adv": ["virtually"] }
  },
  "w_b4_153": {
    "synonyms": ["perceivable", "observable", "apparent"],
    "wordFamily": { "noun": ["visibility"], "adj": ["visible"], "adv": ["visibly"] }
  },
  "w_b4_154": {
    "synonyms": ["sight", "foresight", "concept"],
    "wordFamily": { "noun": ["vision", "visionary"], "adj": ["visionary"] }
  },
  "w_b4_155": {
    "synonyms": ["optical", "ocular", "graphic"],
    "wordFamily": { "noun": ["visuals"], "adj": ["visual"], "adv": ["visually"] }
  },
  "w_b4_156": {
    "synonyms": ["writer", "creator", "originator"],
    "wordFamily": { "noun": ["author", "authorship"], "verb": ["author"] }
  },
  "w_b4_157": {
    "synonyms": ["power", "command", "expert"],
    "wordFamily": { "noun": ["authority", "authorization"], "verb": ["authorize"], "adj": ["authoritative"] }
  },
  "w_b4_158": {
    "synonyms": ["computerize", "mechanize"],
    "wordFamily": { "noun": ["automation"], "verb": ["automate"], "adj": ["automatic", "automated"], "adv": ["automatically"] }
  },
  "w_b4_159": {
    "synonyms": ["accessible", "obtainable", "free"],
    "wordFamily": { "noun": ["availability"], "adj": ["available"] }
  },
  "w_b4_160": {
    "synonyms": ["conscious", "mindful", "informed"],
    "wordFamily": { "noun": ["awareness"], "adj": ["aware"] }
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
console.log('Enrichment for Band 4 Batch 16 completed successfully.');
