import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_31": {
    "synonyms": ["income", "earnings", "yield"],
    "wordFamily": { "noun": ["revenue"] }
  },
  "w_b4_32": {
    "synonyms": ["cost", "charge", "expenditure"],
    "wordFamily": { "noun": ["expense"], "verb": ["expend"], "adj": ["expensive", "inexpensive"], "adv": ["expensively"] }
  },
  "w_b4_33": {
    "synonyms": ["allowance", "allocation", "funds"],
    "wordFamily": { "noun": ["budget"], "verb": ["budget"], "adj": ["budgetary"] }
  },
  "w_b4_34": {
    "synonyms": ["inspection", "examination", "review"],
    "wordFamily": { "noun": ["audit", "auditor"], "verb": ["audit"] }
  },
  "w_b4_35": {
    "synonyms": ["resource", "property", "advantage"],
    "wordFamily": { "noun": ["asset"] }
  },
  "w_b4_36": {
    "synonyms": ["accountability", "obligation", "debt"],
    "wordFamily": { "noun": ["liability"], "adj": ["liable"] }
  },
  "w_b4_37": {
    "synonyms": ["funds", "financing", "wealth"],
    "wordFamily": { "noun": ["capital", "capitalism", "capitalist"], "verb": ["capitalize"], "adj": ["capital"] }
  },
  "w_b4_38": {
    "synonyms": ["share", "portion", "bonus"],
    "wordFamily": { "noun": ["dividend"] }
  },
  "w_b4_39": {
    "synonyms": ["rate", "percentage", "return"],
    "wordFamily": { "noun": ["interest"], "verb": ["interest"], "adj": ["interested", "interesting"], "adv": ["interestingly"] }
  },
  "w_b4_40": {
    "synonyms": ["loan", "pledge", "financing"],
    "wordFamily": { "noun": ["mortgage"], "verb": ["mortgage"] }
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
console.log('Enrichment for Band 4 Batch 4 completed successfully.');
