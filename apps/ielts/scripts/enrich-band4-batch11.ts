import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_101": {
    "synonyms": ["communicate", "connect", "interface"],
    "wordFamily": { "noun": ["interaction"], "verb": ["interact"], "adj": ["interactive"], "adv": ["interactively"] }
  },
  "w_b4_102": {
    "synonyms": ["middle", "midway", "transitional"],
    "wordFamily": { "noun": ["intermediate"], "adj": ["intermediate"] }
  },
  "w_b4_103": {
    "synonyms": ["handle", "control", "influence"],
    "wordFamily": { "noun": ["manipulation", "manipulator"], "verb": ["manipulate"], "adj": ["manipulative"] }
  },
  "w_b4_104": {
    "synonyms": ["edge", "border", "profit"],
    "wordFamily": { "noun": ["margin"], "verb": ["marginalize"], "adj": ["marginal"], "adv": ["marginally"] }
  },
  "w_b4_105": {
    "synonyms": ["adult", "grown-up", "developed"],
    "wordFamily": { "noun": ["maturity"], "verb": ["mature"], "adj": ["mature", "immature"], "adv": ["maturely"] }
  },
  "w_b4_106": {
    "synonyms": ["increase", "optimize", "maximize"],
    "wordFamily": { "noun": ["maximization", "maximum"], "verb": ["maximise", "maximize"], "adj": ["maximum"] }
  },
  "w_b4_107": {
    "synonyms": ["machine", "apparatus", "system"],
    "wordFamily": { "noun": ["mechanism", "mechanic", "mechanics"], "verb": ["mechanize"], "adj": ["mechanical"], "adv": ["mechanically"] }
  },
  "w_b4_108": {
    "synonyms": ["press", "broadcasting", "communications"],
    "wordFamily": { "noun": ["media", "medium"] }
  },
  "w_b4_109": {
    "synonyms": ["arbitrate", "negotiate", "intervene"],
    "wordFamily": { "noun": ["mediation", "mediator"], "verb": ["mediate"] }
  },
  "w_b4_110": {
    "synonyms": ["clinical", "therapeutic", "health"],
    "wordFamily": { "noun": ["medicine", "medic"], "adj": ["medical"], "adv": ["medically"] }
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
console.log('Enrichment for Band 4 Batch 11 completed successfully.');
