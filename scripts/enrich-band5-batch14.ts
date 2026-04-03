import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_131": {
    "synonyms": ["desert", "forsake", "leave"],
    "wordFamily": { "noun": ["abandonment"], "verb": ["abandon"], "adj": ["abandoned"] }
  },
  "w_b5_132": {
    "synonyms": ["institute", "school", "college"],
    "wordFamily": { "noun": ["academy", "academic", "academician"], "adj": ["academic"], "adv": ["academically"] }
  },
  "w_b5_133": {
    "synonyms": ["entry", "admission", "approach"],
    "wordFamily": { "noun": ["access", "accessibility"], "verb": ["access"], "adj": ["accessible", "inaccessible"] }
  },
  "w_b5_134": {
    "synonyms": ["escort", "attend", "follow"],
    "wordFamily": { "noun": ["accompaniment", "accompanist"], "verb": ["accompany"] }
  },
  "w_b5_135": {
    "synonyms": ["precise", "exact", "correct"],
    "wordFamily": { "noun": ["accuracy", "inaccuracy"], "adj": ["accurate", "inaccurate"], "adv": ["accurately"] }
  },
  "w_b5_136": {
    "synonyms": ["attain", "reach", "accomplish"],
    "wordFamily": { "noun": ["achievement", "achiever"], "verb": ["achieve"], "adj": ["achievable"] }
  },
  "w_b5_137": {
    "synonyms": ["admit", "recognize", "accept"],
    "wordFamily": { "noun": ["acknowledgment"], "verb": ["acknowledge"], "adj": ["acknowledged"] }
  },
  "w_b5_138": {
    "synonyms": ["obtain", "get", "gain"],
    "wordFamily": { "noun": ["acquisition"], "verb": ["acquire"], "adj": ["acquisitive"] }
  },
  "w_b5_139": {
    "synonyms": ["mass", "magnitude", "majority"],
    "wordFamily": { "noun": ["bulk"], "adj": ["bulky"] }
  },
  "w_b5_140": {
    "synonyms": ["capability", "volume", "potential"],
    "wordFamily": { "noun": ["capacity", "capacitance"], "adj": ["capacious"] }
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
console.log('Enrichment for Band 5 Batch 14 completed successfully.');
