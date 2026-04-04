import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_161": {
    "synonyms": ["site", "web page"],
    "wordFamily": { "noun": ["website"] }
  },
  "w_b5_162": {
    "synonyms": ["connected", "web-based"],
    "wordFamily": { "noun": ["online"] }
  },
  "w_b5_163": {
    "synonyms": ["disconnected", "local"],
    "wordFamily": { "noun": ["offline"] }
  },
  "w_b5_164": {
    "synonyms": ["actuality", "truth", "fact"],
    "wordFamily": { "noun": ["reality", "realism", "realist"], "verb": ["realize"], "adj": ["real", "realistic"], "adv": ["really", "realistically"] }
  },
  "w_b5_165": {
    "synonyms": ["structure", "organization", "network"],
    "wordFamily": { "noun": ["system", "systematization"], "verb": ["systematize"], "adj": ["systematic"], "adv": ["systematically"] }
  },
  "w_b5_166": {
    "synonyms": ["stage", "podium", "foundation"],
    "wordFamily": { "noun": ["platform"] }
  },
  "w_b5_167": {
    "synonyms": ["connection", "link", "boundary"],
    "wordFamily": { "noun": ["interface"], "verb": ["interface"] }
  },
  "w_b5_168": {
    "synonyms": ["depot", "repository", "warehousing"],
    "wordFamily": { "noun": ["storage", "store"], "verb": ["store"] }
  },
  "w_b5_169": {
    "synonyms": ["recollection", "remembrance", "mind"],
    "wordFamily": { "noun": ["memory", "memorization", "memorial"], "verb": ["memorize", "remember"], "adj": ["memorable"], "adv": ["memorably"] }
  },
  "w_b5_170": {
    "synonyms": ["handler", "converter"],
    "wordFamily": { "noun": ["processor", "process", "processing"], "verb": ["process"] }
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
console.log('Enrichment for Band 5 Batch 17 completed successfully.');
