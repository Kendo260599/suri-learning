import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_181": {
    "synonyms": ["outcome", "consequence", "effect"],
    "wordFamily": { "noun": ["result"], "verb": ["result"], "adj": ["resultant"] }
  },
  "w_b4_182": {
    "synonyms": ["summary", "review", "outline"],
    "wordFamily": { "noun": ["overview"] }
  },
  "w_b4_183": {
    "synonyms": ["particular", "aspect", "item"],
    "wordFamily": { "noun": ["detail"], "verb": ["detail"], "adj": ["detailed"] }
  },
  "w_b4_184": {
    "synonyms": ["individual", "private", "intimate"],
    "wordFamily": { "noun": ["personality", "person"], "adj": ["personal"], "adv": ["personally"] }
  },
  "w_b4_185": {
    "synonyms": ["confidential", "exclusive", "secret"],
    "wordFamily": { "noun": ["privacy"], "adj": ["private"], "adv": ["privately"] }
  },
  "w_b4_186": {
    "synonyms": ["communal", "general", "open"],
    "wordFamily": { "noun": ["public", "publicity"], "verb": ["publicize"], "adj": ["public"], "adv": ["publicly"] }
  },
  "w_b4_187": {
    "synonyms": ["communal", "societal", "gregarious"],
    "wordFamily": { "noun": ["society", "socialization"], "verb": ["socialize"], "adj": ["social"], "adv": ["socially"] }
  },
  "w_b4_188": {
    "synonyms": ["ethnic", "societal", "artistic"],
    "wordFamily": { "noun": ["culture"], "adj": ["cultural"], "adv": ["culturally"] }
  },
  "w_b4_189": {
    "synonyms": ["governmental", "civic", "diplomatic"],
    "wordFamily": { "noun": ["politics", "politician"], "adj": ["political"], "adv": ["politically"] }
  },
  "w_b4_190": {
    "synonyms": ["rational", "reasonable", "coherent"],
    "wordFamily": { "noun": ["logic", "logician"], "adj": ["logical"], "adv": ["logically"] }
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
console.log('Enrichment for Band 4 Batch 19 completed successfully.');
