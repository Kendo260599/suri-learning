import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_111": {
    "synonyms": ["front desk", "welcome", "greeting"],
    "wordFamily": { "noun": ["reception", "receptionist"], "verb": ["receive"], "adj": ["receptive"] }
  },
  "w_b3_112": {
    "synonyms": ["reservation", "appointment", "arrangement"],
    "wordFamily": { "noun": ["booking", "book"], "verb": ["book"] }
  },
  "w_b3_113": {
    "synonyms": ["verification", "validation", "approval"],
    "wordFamily": { "noun": ["confirmation"], "verb": ["confirm"], "adj": ["confirmed"] }
  },
  "w_b3_114": {
    "synonyms": ["timetable", "plan", "itinerary"],
    "wordFamily": { "noun": ["schedule"], "verb": ["schedule"], "adj": ["scheduled"] }
  },
  "w_b3_115": {
    "synonyms": ["schedule", "agenda", "program"],
    "wordFamily": { "noun": ["timetable"] }
  },
  "w_b3_116": {
    "synonyms": ["postponement", "hold-up", "wait"],
    "wordFamily": { "noun": ["delay"], "verb": ["delay"], "adj": ["delayed"] }
  },
  "w_b3_117": {
    "synonyms": ["annulment", "revocation", "abandonment"],
    "wordFamily": { "noun": ["cancellation"], "verb": ["cancel"], "adj": ["canceled"] }
  },
  "w_b3_118": {
    "synonyms": ["repayment", "reimbursement", "rebate"],
    "wordFamily": { "noun": ["refund"], "verb": ["refund"], "adj": ["refundable"] }
  },
  "w_b3_119": {
    "synonyms": ["comeback", "reappearance", "restitution"],
    "wordFamily": { "noun": ["return"], "verb": ["return"], "adj": ["returnable"] }
  },
  "w_b3_120": {
    "synonyms": ["voucher", "slip", "proof of purchase"],
    "wordFamily": { "noun": ["receipt"], "verb": ["receipt"] }
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
console.log('Enrichment for Band 3 Batch 12 completed successfully.');
