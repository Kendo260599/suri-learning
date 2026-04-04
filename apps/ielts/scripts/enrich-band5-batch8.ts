import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_71": {
    "synonyms": ["devise", "formulate", "imagine"],
    "wordFamily": { "noun": ["conception", "concept"], "verb": ["conceive"], "adj": ["conceivable", "conceptual"], "adv": ["conceivably"] }
  },
  "w_b5_72": {
    "synonyms": ["simultaneous", "coincident", "parallel"],
    "wordFamily": { "noun": ["concurrence"], "verb": ["concur"], "adj": ["concurrent"], "adv": ["concurrently"] }
  },
  "w_b5_73": {
    "synonyms": ["favorable", "beneficial", "advantageous"],
    "wordFamily": { "verb": ["conduce"], "adj": ["conducive"] }
  },
  "w_b5_74": {
    "synonyms": ["bestow", "grant", "consult"],
    "wordFamily": { "noun": ["conference", "conferment"], "verb": ["confer"] }
  },
  "w_b5_75": {
    "synonyms": ["restrict", "limit", "enclose"],
    "wordFamily": { "noun": ["confinement", "confines"], "verb": ["confine"], "adj": ["confined"] }
  },
  "w_b5_76": {
    "synonyms": ["outer", "outside", "exterior"],
    "wordFamily": { "noun": ["externality", "exterior"], "adj": ["external"], "adv": ["externally"] }
  },
  "w_b5_77": {
    "synonyms": ["withdraw", "remove", "derive"],
    "wordFamily": { "noun": ["extract", "extraction"], "verb": ["extract"], "adj": ["extractive"] }
  },
  "w_b5_78": {
    "synonyms": ["assist", "expedite", "promote"],
    "wordFamily": { "noun": ["facilitation", "facilitator", "facility"], "verb": ["facilitate"] }
  },
  "w_b5_79": {
    "synonyms": ["element", "component", "influence"],
    "wordFamily": { "noun": ["factor"], "verb": ["factor"] }
  },
  "w_b5_80": {
    "synonyms": ["characteristic", "aspect", "trait"],
    "wordFamily": { "noun": ["feature"], "verb": ["feature"], "adj": ["featured", "featureless"] }
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
console.log('Enrichment for Band 5 Batch 8 completed successfully.');
