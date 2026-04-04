import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_191": {
    "synonyms": ["cause", "justification", "motive"],
    "wordFamily": { "noun": ["reason", "reasoning"], "verb": ["reason"], "adj": ["reasonable"], "adv": ["reasonably"] }
  },
  "w_b4_192": {
    "synonyms": ["fair", "sensible", "moderate"],
    "wordFamily": { "noun": ["reasonableness"], "adj": ["reasonable"], "adv": ["reasonably"] }
  },
  "w_b4_193": {
    "synonyms": ["logical", "coherent", "judicious"],
    "wordFamily": { "noun": ["rationality"], "verb": ["rationalize"], "adj": ["rational"], "adv": ["rationally"] }
  },
  "w_b4_194": {
    "synonyms": ["illogical", "unreasonable", "absurd"],
    "wordFamily": { "noun": ["irrationality"], "adj": ["irrational"], "adv": ["irrationally"] }
  },
  "w_b4_195": {
    "synonyms": ["feeling", "perception", "awareness"],
    "wordFamily": { "noun": ["sense", "sensation", "sensitivity"], "verb": ["sense"], "adj": ["sensory", "sensitive", "senseless"] }
  },
  "w_b4_196": {
    "synonyms": ["practical", "wise", "prudent"],
    "wordFamily": { "noun": ["sensibility"], "adj": ["sensible"], "adv": ["sensibly"] }
  },
  "w_b4_197": {
    "synonyms": ["realistic", "feasible", "functional"],
    "wordFamily": { "noun": ["practicality", "practice"], "verb": ["practice"], "adj": ["practical"], "adv": ["practically"] }
  },
  "w_b4_198": {
    "synonyms": ["reality", "truth", "certainty"],
    "wordFamily": { "noun": ["fact"], "adj": ["factual"], "adv": ["factually"] }
  },
  "w_b4_199": {
    "synonyms": ["accurate", "authentic", "correct"],
    "wordFamily": { "noun": ["fact"], "adj": ["factual"], "adv": ["factually"] }
  },
  "w_b4_200": {
    "synonyms": ["reality", "verity", "fact"],
    "wordFamily": { "noun": ["truth", "truthfulness"], "adj": ["true", "truthful"], "adv": ["truly", "truthfully"] }
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
console.log('Enrichment for Band 4 Batch 20 completed successfully.');
