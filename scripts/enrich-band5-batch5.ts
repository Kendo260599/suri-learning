import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_41": {
    "synonyms": ["digital security", "IT security", "data protection"],
    "wordFamily": { "noun": ["cybersecurity"] }
  },
  "w_b5_42": {
    "synonyms": ["monitoring", "scrutiny", "inspection"],
    "wordFamily": { "noun": ["observation", "observer", "observatory"], "verb": ["observe"], "adj": ["observant", "observable"] }
  },
  "w_b5_43": {
    "synonyms": ["examination", "investigation", "scrutiny"],
    "wordFamily": { "noun": ["analysis", "analyst"], "verb": ["analyze"], "adj": ["analytical"], "adv": ["analytically"] }
  },
  "w_b5_44": {
    "synonyms": ["end", "termination", "deduction"],
    "wordFamily": { "noun": ["conclusion"], "verb": ["conclude"], "adj": ["conclusive"], "adv": ["conclusively"] }
  },
  "w_b5_45": {
    "synonyms": ["proof", "confirmation", "testimony"],
    "wordFamily": { "noun": ["evidence"], "verb": ["evidence"], "adj": ["evident"], "adv": ["evidently"] }
  },
  "w_b5_46": {
    "synonyms": ["study", "inquiry", "exploration"],
    "wordFamily": { "noun": ["research", "researcher"], "verb": ["research"] }
  },
  "w_b5_47": {
    "synonyms": ["structure", "skeleton", "outline"],
    "wordFamily": { "noun": ["framework"] }
  },
  "w_b5_48": {
    "synonyms": ["factor", "element", "parameter"],
    "wordFamily": { "noun": ["variable", "variation", "variety"], "verb": ["vary"], "adj": ["variable", "varied"] }
  },
  "w_b5_49": {
    "synonyms": ["specimen", "example", "instance"],
    "wordFamily": { "noun": ["sample", "sampling"], "verb": ["sample"] }
  },
  "w_b5_50": {
    "synonyms": ["information", "facts", "figures"],
    "wordFamily": { "noun": ["data", "datum"] }
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
console.log('Enrichment for Band 5 Batch 5 completed successfully.');
