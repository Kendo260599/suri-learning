import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_21": {
    "synonyms": ["gravitation", "attraction", "weight"],
    "wordFamily": { "noun": ["gravity", "gravitation"], "verb": ["gravitate"], "adj": ["gravitational"] }
  },
  "w_b5_22": {
    "synonyms": ["air", "aerosphere", "ambiance"],
    "wordFamily": { "noun": ["atmosphere"], "adj": ["atmospheric"], "adv": ["atmospherically"] }
  },
  "w_b5_23": {
    "synonyms": ["emission", "rays", "radioactivity"],
    "wordFamily": { "noun": ["radiation", "radiator"], "verb": ["radiate"], "adj": ["radiant", "radioactive"] }
  },
  "w_b5_24": {
    "synonyms": ["development", "progression", "transformation"],
    "wordFamily": { "noun": ["evolution", "evolutionist"], "verb": ["evolve"], "adj": ["evolutionary"] }
  },
  "w_b5_25": {
    "synonyms": ["heredity", "genomics", "inheritance"],
    "wordFamily": { "noun": ["genetics", "gene", "geneticist"], "adj": ["genetic"], "adv": ["genetically"] }
  },
  "w_b5_26": {
    "synonyms": ["environment", "habitat", "bionetwork"],
    "wordFamily": { "noun": ["ecosystem", "ecology", "ecologist"], "adj": ["ecological"], "adv": ["ecologically"] }
  },
  "w_b5_27": {
    "synonyms": ["biological diversity", "variety", "multiplicity"],
    "wordFamily": { "noun": ["biodiversity"] }
  },
  "w_b5_28": {
    "synonyms": ["preservation", "protection", "safeguarding"],
    "wordFamily": { "noun": ["conservation", "conservatory", "conservationist"], "verb": ["conserve"], "adj": ["conservative"] }
  },
  "w_b5_29": {
    "synonyms": ["sustainable", "inexhaustible", "replenishable"],
    "wordFamily": { "noun": ["renewal"], "verb": ["renew"], "adj": ["renewable"] }
  },
  "w_b5_30": {
    "synonyms": ["empirical", "systematic", "methodical"],
    "wordFamily": { "noun": ["science", "scientist"], "adj": ["scientific"], "adv": ["scientifically"] }
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
console.log('Enrichment for Band 5 Batch 3 completed successfully.');
