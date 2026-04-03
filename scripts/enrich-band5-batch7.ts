import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_61": {
    "synonyms": ["dissertation", "treatise", "proposition"],
    "wordFamily": { "noun": ["thesis", "theses"] }
  },
  "w_b5_62": {
    "synonyms": ["prejudice", "partiality", "predilection"],
    "wordFamily": { "noun": ["bias"], "verb": ["bias"], "adj": ["biased"] }
  },
  "w_b5_63": {
    "synonyms": ["preconception", "bigotry", "intolerance"],
    "wordFamily": { "noun": ["prejudice"], "verb": ["prejudice"], "adj": ["prejudiced", "prejudicial"] }
  },
  "w_b5_64": {
    "synonyms": ["cliché", "convention", "standard"],
    "wordFamily": { "noun": ["stereotype"], "verb": ["stereotype"], "adj": ["stereotypical"], "adv": ["stereotypically"] }
  },
  "w_b5_65": {
    "synonyms": ["inequity", "unfairness", "segregation"],
    "wordFamily": { "noun": ["discrimination"], "verb": ["discriminate"], "adj": ["discriminatory", "discriminating"] }
  },
  "w_b5_66": {
    "synonyms": ["forbearance", "patience", "acceptance"],
    "wordFamily": { "noun": ["tolerance", "toleration"], "verb": ["tolerate"], "adj": ["tolerant", "tolerable"], "adv": ["tolerantly"] }
  },
  "w_b5_67": {
    "synonyms": ["product", "asset", "resource"],
    "wordFamily": { "noun": ["commodity", "commodification"], "verb": ["commodify"] }
  },
  "w_b5_68": {
    "synonyms": ["reimburse", "indemnify", "repay"],
    "wordFamily": { "noun": ["compensation"], "verb": ["compensate"], "adj": ["compensatory"] }
  },
  "w_b5_69": {
    "synonyms": ["constituent", "ingredient", "unit"],
    "wordFamily": { "noun": ["component"] }
  },
  "w_b5_70": {
    "synonyms": ["consist of", "contain", "include"],
    "wordFamily": { "noun": ["comprisal"], "verb": ["comprise"] }
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
console.log('Enrichment for Band 5 Batch 7 completed successfully.');
