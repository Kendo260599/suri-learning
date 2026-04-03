import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_141": {
    "synonyms": ["class", "group", "division"],
    "wordFamily": { "noun": ["category", "categorization"], "verb": ["categorize"], "adj": ["categorical"], "adv": ["categorically"] }
  },
  "w_b5_142": {
    "synonyms": ["reason", "source", "origin"],
    "wordFamily": { "noun": ["cause", "causation", "causality"], "verb": ["cause"], "adj": ["causal"], "adv": ["causally"] }
  },
  "w_b5_143": {
    "synonyms": ["stop", "end", "terminate"],
    "wordFamily": { "noun": ["cease", "cessation"], "verb": ["cease"], "adj": ["ceaseless"], "adv": ["ceaselessly"] }
  },
  "w_b5_144": {
    "synonyms": ["station", "medium", "conduit"],
    "wordFamily": { "noun": ["channel"], "verb": ["channel"] }
  },
  "w_b5_145": {
    "synonyms": ["section", "part", "stage"],
    "wordFamily": { "noun": ["chapter"] }
  },
  "w_b5_146": {
    "synonyms": ["gadget", "apparatus", "instrument"],
    "wordFamily": { "noun": ["device"] }
  },
  "w_b5_147": {
    "synonyms": ["safety", "protection", "defense"],
    "wordFamily": { "noun": ["security", "insecurity"], "verb": ["secure"], "adj": ["secure", "insecure"], "adv": ["securely", "insecurely"] }
  },
  "w_b5_148": {
    "synonyms": ["electronic", "computerized"],
    "wordFamily": { "noun": ["digit", "digitalization"], "verb": ["digitalize"], "adj": ["digital"], "adv": ["digitally"] }
  },
  "w_b5_149": {
    "synonyms": ["notebook", "portable computer"],
    "wordFamily": { "noun": ["laptop"] }
  },
  "w_b5_150": {
    "synonyms": ["display", "monitor", "shield"],
    "wordFamily": { "noun": ["screen", "screening"], "verb": ["screen"] }
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
console.log('Enrichment for Band 5 Batch 15 completed successfully.');
