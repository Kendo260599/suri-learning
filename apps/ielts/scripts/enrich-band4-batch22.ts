import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_211": {
    "synonyms": ["comprehend", "grasp", "perceive"],
    "wordFamily": { "noun": ["understanding"], "verb": ["understand"], "adj": ["understandable"], "adv": ["understandably"] }
  },
  "w_b4_212": {
    "synonyms": ["recall", "recollect", "retain"],
    "wordFamily": { "noun": ["remembrance", "memory"], "verb": ["remember"] }
  },
  "w_b4_213": {
    "synonyms": ["omit", "neglect", "overlook"],
    "wordFamily": { "noun": ["forgetfulness"], "verb": ["forget"], "adj": ["forgetful"], "adv": ["forgetfully"] }
  },
  "w_b4_214": {
    "synonyms": ["envision", "visualize", "conceive"],
    "wordFamily": { "noun": ["imagination"], "verb": ["imagine"], "adj": ["imaginary", "imaginative"], "adv": ["imaginatively"] }
  },
  "w_b4_215": {
    "synonyms": ["estimate", "suppose", "conjecture"],
    "wordFamily": { "noun": ["guess", "guesswork"], "verb": ["guess"] }
  },
  "w_b4_216": {
    "synonyms": ["assume", "presume", "think"],
    "wordFamily": { "noun": ["supposition"], "verb": ["suppose"], "adj": ["supposed"], "adv": ["supposedly"] }
  },
  "w_b4_217": {
    "synonyms": ["goal", "objective", "target"],
    "wordFamily": { "noun": ["aim"], "verb": ["aim"], "adj": ["aimless"], "adv": ["aimlessly"] }
  },
  "w_b4_218": {
    "synonyms": ["reason", "intent", "function"],
    "wordFamily": { "noun": ["purpose"], "adj": ["purposeful", "purposeless"], "adv": ["purposefully"] }
  },
  "w_b4_219": {
    "synonyms": ["plan", "aim", "design"],
    "wordFamily": { "noun": ["intention", "intent"], "verb": ["intend"], "adj": ["intentional", "intended"], "adv": ["intentionally"] }
  },
  "w_b4_220": {
    "synonyms": ["selection", "option", "alternative"],
    "wordFamily": { "noun": ["choice"], "verb": ["choose"], "adj": ["choosy"] }
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
console.log('Enrichment for Band 4 Batch 22 completed successfully.');
