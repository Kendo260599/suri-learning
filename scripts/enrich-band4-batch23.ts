import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_221": {
    "synonyms": ["generate", "produce", "establish"],
    "wordFamily": { "noun": ["creation", "creator", "creativity"], "verb": ["create"], "adj": ["creative"], "adv": ["creatively"] }
  },
  "w_b4_222": {
    "synonyms": ["ruin", "demolish", "wreck"],
    "wordFamily": { "noun": ["destruction", "destroyer"], "verb": ["destroy"], "adj": ["destructive"], "adv": ["destructively"] }
  },
  "w_b4_223": {
    "synonyms": ["construct", "erect", "assemble"],
    "wordFamily": { "noun": ["building", "builder"], "verb": ["build"] }
  },
  "w_b4_224": {
    "synonyms": ["build", "erect", "fabricate"],
    "wordFamily": { "noun": ["construction", "constructor"], "verb": ["construct"], "adj": ["constructive"], "adv": ["constructively"] }
  },
  "w_b4_225": {
    "synonyms": ["plan", "outline", "sketch"],
    "wordFamily": { "noun": ["design", "designer"], "verb": ["design"] }
  },
  "w_b4_226": {
    "synonyms": ["originate", "conceive", "devise"],
    "wordFamily": { "noun": ["invention", "inventor"], "verb": ["invent"], "adj": ["inventive"], "adv": ["inventively"] }
  },
  "w_b4_227": {
    "synonyms": ["find", "uncover", "reveal"],
    "wordFamily": { "noun": ["discovery", "discoverer"], "verb": ["discover"] }
  },
  "w_b4_228": {
    "synonyms": ["make", "manufacture", "generate"],
    "wordFamily": { "noun": ["product", "production", "producer"], "verb": ["produce"], "adj": ["productive"], "adv": ["productively"] }
  },
  "w_b4_229": {
    "synonyms": ["make", "produce", "fabricate"],
    "wordFamily": { "noun": ["manufacture", "manufacturer"], "verb": ["manufacture"] }
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
console.log('Enrichment for Band 4 Batch 23 completed successfully.');
