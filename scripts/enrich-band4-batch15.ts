import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_141": {
    "synonyms": ["foundation", "basis", "root"],
    "wordFamily": { "verb": ["underlie"], "adj": ["underlying"] }
  },
  "w_b4_142": {
    "synonyms": ["take on", "assume", "perform"],
    "wordFamily": { "noun": ["undertaking"], "verb": ["undertake"] }
  },
  "w_b4_143": {
    "synonyms": ["consistent", "even", "homogeneous"],
    "wordFamily": { "noun": ["uniform", "uniformity"], "adj": ["uniform"], "adv": ["uniformly"] }
  },
  "w_b4_144": {
    "synonyms": ["unite", "combine", "merge"],
    "wordFamily": { "noun": ["unification"], "verb": ["unify"], "adj": ["unifying", "unified"] }
  },
  "w_b4_145": {
    "synonyms": ["distinctive", "sole", "unparalleled"],
    "wordFamily": { "noun": ["uniqueness"], "adj": ["unique"], "adv": ["uniquely"] }
  },
  "w_b4_146": {
    "synonyms": ["use", "employ", "exploit"],
    "wordFamily": { "noun": ["utilization", "utility"], "verb": ["utilize"], "adj": ["utilitarian"] }
  },
  "w_b4_147": {
    "synonyms": ["differ", "fluctuate", "change"],
    "wordFamily": { "noun": ["variation", "variety", "variable"], "verb": ["vary"], "adj": ["various", "varied", "variable"], "adv": ["variably", "variously"] }
  },
  "w_b4_148": {
    "synonyms": ["conveyance", "transport", "medium"],
    "wordFamily": { "noun": ["vehicle"], "adj": ["vehicular"] }
  },
  "w_b4_149": {
    "synonyms": ["edition", "variant", "account"],
    "wordFamily": { "noun": ["version"] }
  },
  "w_b4_150": {
    "synonyms": ["through", "by way of", "by means of"],
    "wordFamily": { "prep": ["via"] }
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
console.log('Enrichment for Band 4 Batch 15 completed successfully.');
