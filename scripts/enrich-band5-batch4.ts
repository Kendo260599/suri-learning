import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_31": {
    "synonyms": ["finding", "breakthrough", "revelation"],
    "wordFamily": { "noun": ["discovery", "discoverer"], "verb": ["discover"] }
  },
  "w_b5_32": {
    "synonyms": ["test", "trial", "investigation"],
    "wordFamily": { "noun": ["experiment", "experimentation", "experimentalist"], "verb": ["experiment"], "adj": ["experimental"], "adv": ["experimentally"] }
  },
  "w_b5_33": {
    "synonyms": ["synthetic", "man-made", "simulated"],
    "wordFamily": { "noun": ["artificiality"], "adj": ["artificial"], "adv": ["artificially"] }
  },
  "w_b5_34": {
    "synonyms": ["intellect", "acumen", "wit"],
    "wordFamily": { "noun": ["intelligence"], "adj": ["intelligent"], "adv": ["intelligently"] }
  },
  "w_b5_35": {
    "synonyms": ["procedure", "formula", "computation"],
    "wordFamily": { "noun": ["algorithm"], "adj": ["algorithmic"], "adv": ["algorithmically"] }
  },
  "w_b5_36": {
    "synonyms": ["program", "application", "code"],
    "wordFamily": { "noun": ["software"] }
  },
  "w_b5_37": {
    "synonyms": ["equipment", "machinery", "apparatus"],
    "wordFamily": { "noun": ["hardware"] }
  },
  "w_b5_38": {
    "synonyms": ["web", "grid", "system"],
    "wordFamily": { "noun": ["network", "networking"], "verb": ["network"] }
  },
  "w_b5_39": {
    "synonyms": ["data bank", "repository", "archive"],
    "wordFamily": { "noun": ["database"] }
  },
  "w_b5_40": {
    "synonyms": ["coding", "scripting", "development"],
    "wordFamily": { "noun": ["programming", "program", "programmer"], "verb": ["program"], "adj": ["programmable"] }
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
console.log('Enrichment for Band 5 Batch 4 completed successfully.');
