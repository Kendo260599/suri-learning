import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_151": {
    "synonyms": ["inexpensive", "low-cost", "economical"],
    "wordFamily": { "noun": ["cheapness"], "verb": ["cheapen"], "adj": ["cheap"], "adv": ["cheaply"] }
  },
  "w_b3_152": {
    "synonyms": ["inexpensive", "reasonable", "cheap"],
    "wordFamily": { "noun": ["affordability"], "verb": ["afford"], "adj": ["affordable"] }
  },
  "w_b3_153": {
    "synonyms": ["invaluable", "precious", "beyond price"],
    "wordFamily": { "noun": ["price"], "verb": ["price"], "adj": ["priceless"] }
  },
  "w_b3_154": {
    "synonyms": ["precious", "costly", "important"],
    "wordFamily": { "noun": ["value", "valuables", "valuation"], "verb": ["value", "evaluate"], "adj": ["valuable"] }
  },
  "w_b3_155": {
    "synonyms": ["valueless", "useless", "insignificant"],
    "wordFamily": { "noun": ["worth", "worthlessness"], "adj": ["worthless"] }
  },
  "w_b3_156": {
    "synonyms": ["secure", "protected", "unharmed"],
    "wordFamily": { "noun": ["safety", "safe"], "verb": ["save"], "adj": ["safe"], "adv": ["safely"] }
  },
  "w_b3_157": {
    "synonyms": ["hazardous", "perilous", "unsafe"],
    "wordFamily": { "noun": ["danger"], "verb": ["endanger"], "adj": ["dangerous"], "adv": ["dangerously"] }
  },
  "w_b3_158": {
    "synonyms": ["safe", "protected", "stable"],
    "wordFamily": { "noun": ["security"], "verb": ["secure"], "adj": ["secure", "insecure"], "adv": ["securely"] }
  },
  "w_b3_159": {
    "synonyms": ["hazardous", "dangerous", "perilous"],
    "wordFamily": { "noun": ["risk"], "verb": ["risk"], "adj": ["risky"] }
  },
  "w_b3_160": {
    "synonyms": ["damaging", "injurious", "detrimental"],
    "wordFamily": { "noun": ["harm"], "verb": ["harm"], "adj": ["harmful", "harmless"], "adv": ["harmfully"] }
  },
  "w_b3_161": {
    "synonyms": ["safe", "innocuous", "benign"],
    "wordFamily": { "noun": ["harm"], "verb": ["harm"], "adj": ["harmless", "harmful"], "adv": ["harmlessly"] }
  },
  "w_b3_162": {
    "synonyms": ["poisonous", "venomous", "deadly"],
    "wordFamily": { "noun": ["toxin", "toxicity"], "adj": ["toxic"] }
  },
  "w_b3_163": {
    "synonyms": ["fatal", "lethal", "mortal"],
    "wordFamily": { "noun": ["death", "dead"], "verb": ["die", "deaden"], "adj": ["dead", "deadly"] }
  },
  "w_b3_164": {
    "synonyms": ["deadly", "lethal", "mortal"],
    "wordFamily": { "noun": ["fatality", "fate"], "adj": ["fatal", "fated"], "adv": ["fatally"] }
  },
  "w_b3_165": {
    "synonyms": ["fatal", "deadly", "mortal"],
    "wordFamily": { "noun": ["lethality"], "adj": ["lethal"], "adv": ["lethally"] }
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
console.log('Enrichment for Band 3 Batch 16 completed successfully.');
