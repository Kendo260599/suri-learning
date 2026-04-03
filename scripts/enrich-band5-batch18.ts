import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_171": {
    "synonyms": ["device", "appliance", "implement"],
    "wordFamily": { "noun": ["gadget", "gadgetry"] }
  },
  "w_b5_172": {
    "synonyms": ["apparatus", "gear", "tackle"],
    "wordFamily": { "noun": ["equipment"], "verb": ["equip"], "adj": ["equipped"] }
  },
  "w_b5_173": {
    "synonyms": ["implement", "utensil", "device"],
    "wordFamily": { "noun": ["instrument", "instrumentation"], "adj": ["instrumental"] }
  },
  "w_b5_174": {
    "synonyms": ["implement", "utensil", "device"],
    "wordFamily": { "noun": ["tool"], "verb": ["tool"] }
  },
  "w_b5_175": {
    "synonyms": ["network", "mesh", "lattice"],
    "wordFamily": { "noun": ["web", "website", "webpage"] }
  },
  "w_b5_176": {
    "synonyms": ["location", "place", "position"],
    "wordFamily": { "noun": ["site"], "verb": ["site"] }
  },
  "w_b5_177": {
    "synonyms": ["leaf", "sheet", "folio"],
    "wordFamily": { "noun": ["page", "pagination"], "verb": ["page"] }
  },
  "w_b5_178": {
    "synonyms": ["lecturer", "orator", "loudspeaker"],
    "wordFamily": { "noun": ["speaker", "speech"], "verb": ["speak"], "adj": ["spoken"] }
  },
  "w_b5_179": {
    "synonyms": ["mic", "transmitter"],
    "wordFamily": { "noun": ["microphone"] }
  },
  "w_b5_180": {
    "synonyms": ["camcorder", "recorder"],
    "wordFamily": { "noun": ["camera", "cameraman"] }
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
    
    const lastPropertyMatch = /"topicId":\\s*"[^"]*"\s*(?=\n\s*})/.exec(entryBlock);
    
    if (lastPropertyMatch) {
      const insertIndex = lastPropertyMatch.index + lastPropertyMatch[0].length;
      const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
      
      const newEntryBlock = entryBlock.slice(0, insertIndex) + enrichmentStr + entryBlock.slice(insertIndex);
      content = content.replace(entryBlock, newEntryBlock);
    } else {
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
console.log('Enrichment for Band 5 Batch 18 completed successfully.');
