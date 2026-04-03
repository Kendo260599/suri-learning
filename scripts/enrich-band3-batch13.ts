import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_121": {
    "synonyms": ["remittance", "settlement", "fee"],
    "wordFamily": { "noun": ["payment", "pay", "payee", "payer"], "verb": ["pay"], "adj": ["payable"] }
  },
  "w_b3_122": {
    "synonyms": ["money", "currency", "coin"],
    "wordFamily": { "noun": ["cash", "cashier"], "verb": ["cash"] }
  },
  "w_b3_123": {
    "synonyms": ["trust", "loan", "advance"],
    "wordFamily": { "noun": ["credit", "creditor"], "verb": ["credit"], "adj": ["creditable"] }
  },
  "w_b3_124": {
    "synonyms": ["charge", "deduction", "withdrawal"],
    "wordFamily": { "noun": ["debit"], "verb": ["debit"] }
  },
  "w_b3_125": {
    "synonyms": ["pass", "ticket", "badge"],
    "wordFamily": { "noun": ["card", "cardboard"] }
  },
  "w_b3_126": {
    "synonyms": ["purse", "billfold", "pocketbook"],
    "wordFamily": { "noun": ["wallet"] }
  },
  "w_b3_127": {
    "synonyms": ["handbag", "wallet", "pouch"],
    "wordFamily": { "noun": ["purse"], "verb": ["purse"] }
  },
  "w_b3_128": {
    "synonyms": ["invoice", "statement", "account"],
    "wordFamily": { "noun": ["bill", "billing"], "verb": ["bill"] }
  },
  "w_b3_129": {
    "synonyms": ["bill", "statement", "account"],
    "wordFamily": { "noun": ["invoice"], "verb": ["invoice"] }
  },
  "w_b3_130": {
    "synonyms": ["declaration", "announcement", "account"],
    "wordFamily": { "noun": ["statement"], "verb": ["state"], "adj": ["stated"] }
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
console.log('Enrichment for Band 3 Batch 13 completed successfully.');
