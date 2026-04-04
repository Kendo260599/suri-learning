import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_141": {
    "synonyms": ["purchase", "acquire", "procure"],
    "wordFamily": { "noun": ["buyer", "buy"], "verb": ["buy"] }
  },
  "w_b3_142": {
    "synonyms": ["vend", "trade", "retail"],
    "wordFamily": { "noun": ["seller", "sale"], "verb": ["sell"] }
  },
  "w_b3_143": {
    "synonyms": ["expend", "pay out", "consume"],
    "wordFamily": { "noun": ["spending", "spender"], "verb": ["spend"] }
  },
  "w_b3_144": {
    "synonyms": ["preserve", "conserve", "rescue"],
    "wordFamily": { "noun": ["savings", "saver", "savior"], "verb": ["save"], "adj": ["safe"] }
  },
  "w_b3_145": {
    "synonyms": ["make", "gain", "acquire"],
    "wordFamily": { "noun": ["earnings", "earner"], "verb": ["earn"] }
  },
  "w_b3_146": {
    "synonyms": ["remit", "settle", "compensate"],
    "wordFamily": { "noun": ["payment", "pay", "payee", "payer"], "verb": ["pay"], "adj": ["payable"] }
  },
  "w_b3_147": {
    "synonyms": ["value", "merit", "significance"],
    "wordFamily": { "noun": ["worth", "worthiness"], "adj": ["worthy", "worthless"] }
  },
  "w_b3_148": {
    "synonyms": ["rich", "affluent", "prosperous"],
    "wordFamily": { "noun": ["wealth"], "adj": ["wealthy"], "adv": ["wealthily"] }
  },
  "w_b3_149": {
    "synonyms": ["bankrupt", "penniless", "insolvent"],
    "wordFamily": { "verb": ["break"] }
  },
  "w_b3_150": {
    "synonyms": ["costly", "pricey", "dear"],
    "wordFamily": { "noun": ["expense"], "adj": ["expensive"], "adv": ["expensively"] }
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
console.log('Enrichment for Band 3 Batch 15 completed successfully.');
