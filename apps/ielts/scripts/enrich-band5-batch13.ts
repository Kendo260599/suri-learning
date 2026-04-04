import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_121": {
    "synonyms": ["figure", "datum", "number"],
    "wordFamily": { "noun": ["statistics", "statistician", "statistic"], "adj": ["statistical"], "adv": ["statistically"] }
  },
  "w_b5_122": {
    "synonyms": ["standing", "rank", "condition"],
    "wordFamily": { "noun": ["status"] }
  },
  "w_b5_123": {
    "synonyms": ["replacement", "proxy", "alternative"],
    "wordFamily": { "noun": ["substitute", "substitution"], "verb": ["substitute"] }
  },
  "w_b5_124": {
    "synonyms": ["adequate", "enough", "ample"],
    "wordFamily": { "noun": ["sufficiency"], "adj": ["sufficient"], "adv": ["sufficiently"] }
  },
  "w_b5_125": {
    "synonyms": ["abstract", "synopsis", "outline"],
    "wordFamily": { "noun": ["summary", "summation"], "verb": ["summarize"], "adj": ["summary"], "adv": ["summarily"] }
  },
  "w_b5_126": {
    "synonyms": ["capacity", "quantity", "loudness"],
    "wordFamily": { "noun": ["volume"], "adj": ["voluminous"], "adv": ["voluminously"] }
  },
  "w_b5_127": {
    "synonyms": ["optional", "discretionary", "unpaid"],
    "wordFamily": { "noun": ["volunteer", "voluntarism"], "verb": ["volunteer"], "adj": ["voluntary"], "adv": ["voluntarily"] }
  },
  "w_b5_128": {
    "synonyms": ["while", "though", "although"],
    "wordFamily": {}
  },
  "w_b5_129": {
    "synonyms": ["by which", "through which"],
    "wordFamily": {}
  },
  "w_b5_130": {
    "synonyms": ["extensive", "prevalent", "pervasive"],
    "wordFamily": { "noun": ["widespreadness"], "adj": ["widespread"] }
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
console.log('Enrichment for Band 5 Batch 13 completed successfully.');
