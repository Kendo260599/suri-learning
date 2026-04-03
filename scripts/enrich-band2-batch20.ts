import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_191": {
    "synonyms": ["mean", "median", "standard"],
    "wordFamily": { "noun": ["average"], "verb": ["average"], "adj": ["average"] }
  },
  "w_b2_192": {
    "synonyms": ["fast", "rapid", "swift"],
    "wordFamily": { "noun": ["quickness"], "verb": ["quicken"], "adj": ["quick"], "adv": ["quickly"] }
  },
  "w_b2_193": {
    "synonyms": ["fast", "quick", "swift"],
    "wordFamily": { "noun": ["rapidity"], "adj": ["rapid"], "adv": ["rapidly"] }
  },
  "w_b2_194": {
    "synonyms": ["slow", "steady", "progressive"],
    "wordFamily": { "adj": ["gradual"], "adv": ["gradually"] }
  },
  "w_b2_195": {
    "synonyms": ["abrupt", "unexpected", "unforeseen"],
    "wordFamily": { "noun": ["suddenness"], "adj": ["sudden"], "adv": ["suddenly"] }
  },
  "w_b2_196": {
    "synonyms": ["instant", "prompt", "instantaneous"],
    "wordFamily": { "noun": ["immediacy"], "adj": ["immediate"], "adv": ["immediately"] }
  },
  "w_b2_197": {
    "synonyms": ["immediate", "prompt", "instantaneous"],
    "wordFamily": { "noun": ["instant", "instance"], "adj": ["instant"], "adv": ["instantly"] }
  },
  "w_b2_198": {
    "synonyms": ["quick", "swift", "immediate"],
    "wordFamily": { "noun": ["promptness"], "verb": ["prompt"], "adj": ["prompt"], "adv": ["promptly"] }
  },
  "w_b2_199": {
    "synonyms": ["fast", "rapid", "quick"],
    "wordFamily": { "noun": ["swiftness"], "adj": ["swift"], "adv": ["swiftly"] }
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
    }
  }
}

fs.writeFileSync(filePath, content);
console.log('Enrichment for Band 2 Batch 20 completed successfully.');
