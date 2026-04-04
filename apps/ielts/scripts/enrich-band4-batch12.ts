import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_111": {
    "synonyms": ["means", "method", "channel"],
    "wordFamily": { "noun": ["medium"] }
  },
  "w_b4_112": {
    "synonyms": ["intellectual", "psychological", "cognitive"],
    "wordFamily": { "noun": ["mentality"], "adj": ["mental"], "adv": ["mentally"] }
  },
  "w_b4_113": {
    "synonyms": ["total", "combined", "cumulative"],
    "wordFamily": { "noun": ["aggregate", "aggregation"], "verb": ["aggregate"], "adj": ["aggregate"] }
  },
  "w_b4_114": {
    "synonyms": ["assign", "distribute", "apportion"],
    "wordFamily": { "noun": ["allocation"], "verb": ["allocate"] }
  },
  "w_b4_115": {
    "synonyms": ["allocate", "appoint", "designate"],
    "wordFamily": { "noun": ["assignment"], "verb": ["assign"] }
  },
  "w_b4_116": {
    "synonyms": ["connection", "tie", "link"],
    "wordFamily": { "noun": ["bond", "bonding"], "verb": ["bond"] }
  },
  "w_b4_117": {
    "synonyms": ["short", "concise", "quick"],
    "wordFamily": { "noun": ["brief", "briefing"], "verb": ["brief"], "adj": ["brief"], "adv": ["briefly"] }
  },
  "w_b4_118": {
    "synonyms": ["able", "competent", "proficient"],
    "wordFamily": { "noun": ["capability"], "adj": ["capable", "incapable"], "adv": ["capably"] }
  },
  "w_b4_119": {
    "synonyms": ["quote", "reference", "mention"],
    "wordFamily": { "noun": ["citation"], "verb": ["cite"] }
  },
  "w_b4_120": {
    "synonyms": ["collaborate", "work together", "assist"],
    "wordFamily": { "noun": ["cooperation", "cooperator"], "verb": ["cooperate"], "adj": ["cooperative"], "adv": ["cooperatively"] }
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
console.log('Enrichment for Band 4 Batch 12 completed successfully.');
