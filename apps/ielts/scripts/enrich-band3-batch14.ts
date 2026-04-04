import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_131": {
    "synonyms": ["reduction", "deduction", "allowance"],
    "wordFamily": { "noun": ["discount"], "verb": ["discount"] }
  },
  "w_b3_132": {
    "synonyms": ["selling", "deal", "transaction"],
    "wordFamily": { "noun": ["sale", "salesman", "saleswoman"], "verb": ["sell"], "adj": ["salable"] }
  },
  "w_b3_133": {
    "synonyms": ["deal", "discount", "steal"],
    "wordFamily": { "noun": ["bargain"], "verb": ["bargain"] }
  },
  "w_b3_134": {
    "synonyms": ["agreement", "arrangement", "contract"],
    "wordFamily": { "noun": ["deal", "dealer"], "verb": ["deal"] }
  },
  "w_b3_135": {
    "synonyms": ["proposal", "proposition", "bid"],
    "wordFamily": { "noun": ["offer", "offering"], "verb": ["offer"] }
  },
  "w_b3_136": {
    "synonyms": ["cost", "charge", "fee"],
    "wordFamily": { "noun": ["price", "pricing"], "verb": ["price"], "adj": ["pricey"] }
  },
  "w_b3_137": {
    "synonyms": ["price", "expense", "charge"],
    "wordFamily": { "noun": ["cost", "costing"], "verb": ["cost"], "adj": ["costly"] }
  },
  "w_b3_138": {
    "synonyms": ["worth", "usefulness", "importance"],
    "wordFamily": { "noun": ["value", "valuation"], "verb": ["value", "evaluate"], "adj": ["valuable", "valueless"] }
  },
  "w_b3_139": {
    "synonyms": ["responsibility", "obligation", "tax"],
    "wordFamily": { "noun": ["duty"], "adj": ["dutiful"], "adv": ["dutifully"] }
  },
  "w_b3_140": {
    "synonyms": ["lease", "hire", "payment"],
    "wordFamily": { "noun": ["rent", "rental", "renter"], "verb": ["rent"] }
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
console.log('Enrichment for Band 3 Batch 14 completed successfully.');
