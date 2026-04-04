import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_1": {
    "synonyms": ["execution", "application", "fulfillment"],
    "wordFamily": { "noun": ["implementation"], "verb": ["implement"] }
  },
  "w_b5_2": {
    "synonyms": ["unification", "combination", "merger"],
    "wordFamily": { "noun": ["integration", "integrity"], "verb": ["integrate"], "adj": ["integrated"] }
  },
  "w_b5_3": {
    "synonyms": ["cooperation", "partnership", "teamwork"],
    "wordFamily": { "noun": ["collaboration", "collaborator"], "verb": ["collaborate"], "adj": ["collaborative"], "adv": ["collaboratively"] }
  },
  "w_b5_4": {
    "synonyms": ["viability", "endurance", "feasibility"],
    "wordFamily": { "noun": ["sustainability"], "verb": ["sustain"], "adj": ["sustainable"], "adv": ["sustainably"] }
  },
  "w_b5_5": {
    "synonyms": ["alteration", "conversion", "metamorphosis"],
    "wordFamily": { "noun": ["transformation", "transformer"], "verb": ["transform"], "adj": ["transformational"] }
  },
  "w_b5_6": {
    "synonyms": ["effectiveness", "productivity", "competence"],
    "wordFamily": { "noun": ["efficiency"], "adj": ["efficient"], "adv": ["efficiently"] }
  },
  "w_b5_7": {
    "synonyms": ["fairness", "justice", "impartiality"],
    "wordFamily": { "noun": ["equity"], "adj": ["equitable"], "adv": ["equitably"] }
  },
  "w_b5_8": {
    "synonyms": ["flexibility", "toughness", "durability"],
    "wordFamily": { "noun": ["resilience"], "adj": ["resilient"], "adv": ["resiliently"] }
  },
  "w_b5_9": {
    "synonyms": ["flexibility", "versatility", "compliance"],
    "wordFamily": { "noun": ["adaptability", "adaptation"], "verb": ["adapt"], "adj": ["adaptable"] }
  },
  "w_b5_10": {
    "synonyms": ["output", "yield", "efficiency"],
    "wordFamily": { "noun": ["productivity", "product", "production"], "verb": ["produce"], "adj": ["productive"], "adv": ["productively"] }
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
    const lastPropertyMatch = /"topicId":\\s*"[^"]*"\s*(?=\n\s*})/.exec(entryBlock);
    
    if (lastPropertyMatch) {
      const insertIndex = lastPropertyMatch.index + lastPropertyMatch[0].length;
      const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
      
      const newEntryBlock = entryBlock.slice(0, insertIndex) + enrichmentStr + entryBlock.slice(insertIndex);
      content = content.replace(entryBlock, newEntryBlock);
    } else {
        // Fallback if the regex above fails due to formatting
        const topicIdIndex = entryBlock.lastIndexOf('"topicId":');
        if (topicIdIndex !== -1) {
            const closingBraceIndex = entryBlock.indexOf('}', topicIdIndex);
            if (closingBraceIndex !== -1) {
                const beforeBrace = entryBlock.substring(0, closingBraceIndex);
                const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
                const newEntryBlock = beforeBrace + enrichmentStr + entryBlock.substring(closingBraceIndex);
                content = content.replace(entryBlock, newEntryBlock);
            }
        }
    }
  }
}

fs.writeFileSync(filePath, content);
console.log('Enrichment for Band 5 Batch 1 completed successfully.');
