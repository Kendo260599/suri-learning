import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_151": {
    "synonyms": ["keypad"],
    "wordFamily": { "noun": ["keyboard", "keyboardist"] }
  },
  "w_b5_152": {
    "synonyms": ["pointing device"],
    "wordFamily": { "noun": ["mouse"] }
  },
  "w_b5_153": {
    "synonyms": ["press"],
    "wordFamily": { "noun": ["printer", "print", "printing"], "verb": ["print"], "adj": ["printable"] }
  },
  "w_b5_154": {
    "synonyms": ["reader", "digitizer"],
    "wordFamily": { "noun": ["scanner", "scan"], "verb": ["scan"] }
  },
  "w_b5_155": {
    "synonyms": ["link", "tie", "association"],
    "wordFamily": { "noun": ["connection", "connector"], "verb": ["connect"], "adj": ["connected", "connective"] }
  },
  "w_b5_156": {
    "synonyms": ["cordless", "radio"],
    "wordFamily": { "noun": ["wireless"] }
  },
  "w_b5_157": {
    "synonyms": ["short-range wireless"],
    "wordFamily": { "noun": ["bluetooth"] }
  },
  "w_b5_158": {
    "synonyms": ["request", "use", "app"],
    "wordFamily": { "noun": ["application", "applicant", "appliance"], "verb": ["apply"], "adj": ["applicable", "applied"] }
  },
  "w_b5_159": {
    "synonyms": ["schedule", "plan", "software"],
    "wordFamily": { "noun": ["program", "programmer", "programming"], "verb": ["program"], "adj": ["programmatic"], "adv": ["programmatically"] }
  },
  "w_b5_160": {
    "synonyms": ["host", "waiter"],
    "wordFamily": { "noun": ["server", "service", "servant"], "verb": ["serve"] }
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
console.log('Enrichment for Band 5 Batch 16 completed successfully.');
