import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_151": {
    "synonyms": ["well-liked", "favored", "prevalent"],
    "wordFamily": { "noun": ["popularity"], "verb": ["popularize"], "adj": ["popular"], "adv": ["popularly"] }
  },
  "w_b2_152": {
    "synonyms": ["uncommon", "scarce", "infrequent"],
    "wordFamily": { "noun": ["rarity"], "adj": ["rare"], "adv": ["rarely"] }
  },
  "w_b2_153": {
    "synonyms": ["exceptional", "unique", "distinctive"],
    "wordFamily": { "noun": ["specialty", "specialist"], "verb": ["specialize"], "adj": ["special"], "adv": ["specially"] }
  },
  "w_b2_154": {
    "synonyms": ["normal", "usual", "common"],
    "wordFamily": { "noun": ["ordinariness"], "adj": ["ordinary"], "adv": ["ordinarily"] }
  },
  "w_b2_155": {
    "synonyms": ["uncomplicated", "straightforward", "plain"],
    "wordFamily": { "noun": ["simplicity"], "verb": ["simplify"], "adj": ["simple"], "adv": ["simply"] }
  },
  "w_b2_156": {
    "synonyms": ["effortless", "undemanding", "painless"],
    "wordFamily": { "noun": ["ease"], "verb": ["ease"], "adj": ["easy"], "adv": ["easily"] }
  },
  "w_b2_157": {
    "synonyms": ["hard", "challenging", "demanding"],
    "wordFamily": { "noun": ["difficulty"], "adj": ["difficult"] }
  },
  "w_b2_158": {
    "synonyms": ["sturdy", "strong", "resilient"],
    "wordFamily": { "noun": ["toughness"], "verb": ["toughen"], "adj": ["tough"], "adv": ["toughly"] }
  },
  "w_b2_159": {
    "synonyms": ["firm", "hard", "sturdy"],
    "wordFamily": { "noun": ["solidity", "solidness"], "verb": ["solidify"], "adj": ["solid"], "adv": ["solidly"] }
  },
  "w_b2_160": {
    "synonyms": ["fluid", "liquor", "solution"],
    "wordFamily": { "noun": ["liquid", "liquidity"], "verb": ["liquefy"], "adj": ["liquid"] }
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
console.log('Enrichment for Band 2 Batch 16 completed successfully.');
