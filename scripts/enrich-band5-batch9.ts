import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_81": {
    "synonyms": ["central", "national", "state"],
    "wordFamily": { "noun": ["federation", "federalism", "federalist"], "adj": ["federal"], "adv": ["federally"] }
  },
  "w_b5_82": {
    "synonyms": ["charge", "cost", "price"],
    "wordFamily": { "noun": ["fee"] }
  },
  "w_b5_83": {
    "synonyms": ["folder", "dossier", "document"],
    "wordFamily": { "noun": ["file", "filing"], "verb": ["file"] }
  },
  "w_b5_84": {
    "synonyms": ["ultimate", "concluding", "terminal"],
    "wordFamily": { "noun": ["final", "finality", "finalist"], "verb": ["finalize"], "adj": ["final"], "adv": ["finally"] }
  },
  "w_b5_85": {
    "synonyms": ["funding", "capital", "investment"],
    "wordFamily": { "noun": ["finance", "finances", "financier"], "verb": ["finance"], "adj": ["financial"], "adv": ["financially"] }
  },
  "w_b5_86": {
    "synonyms": ["picture", "representation", "likeness"],
    "wordFamily": { "noun": ["image", "imagery"], "verb": ["imagine", "image"], "adj": ["imaginary", "imaginative"], "adv": ["imaginatively"] }
  },
  "w_b5_87": {
    "synonyms": ["migrate", "settle", "relocate"],
    "wordFamily": { "noun": ["immigration", "immigrant"], "verb": ["immigrate"] }
  },
  "w_b5_88": {
    "synonyms": ["execute", "apply", "enforce"],
    "wordFamily": { "noun": ["implementation", "implement"], "verb": ["implement"] }
  },
  "w_b5_89": {
    "synonyms": ["incriminate", "involve", "entangle"],
    "wordFamily": { "noun": ["implication"], "verb": ["implicate"] }
  },
  "w_b5_90": {
    "synonyms": ["insinuate", "suggest", "hint"],
    "wordFamily": { "noun": ["implication"], "verb": ["imply"], "adj": ["implicit"], "adv": ["implicitly"] }
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
    
    const lastPropertyMatch = /"topicId":\\s*"[^"]*"\s*(?=\n\s*})/.exec(entryBlock);
    
    if (lastPropertyMatch) {
      const insertIndex = lastPropertyMatch.index + lastPropertyMatch[0].length;
      const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
      
      const newEntryBlock = entryBlock.slice(0, insertIndex) + enrichmentStr + entryBlock.slice(insertIndex);
      content = content.replace(entryBlock, newEntryBlock);
    } else {
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
console.log('Enrichment for Band 5 Batch 9 completed successfully.');
