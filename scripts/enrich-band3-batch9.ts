import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_81": {
    "synonyms": ["examination", "inspection", "assessment"],
    "wordFamily": { "noun": ["check-up"], "verb": ["check"] }
  },
  "w_b3_82": {
    "synonyms": ["workplace", "bureau", "agency"],
    "wordFamily": { "noun": ["office", "officer", "official"], "adj": ["official"], "adv": ["officially"] }
  },
  "w_b3_83": {
    "synonyms": ["plant", "mill", "works"],
    "wordFamily": { "noun": ["factory"] }
  },
  "w_b3_84": {
    "synonyms": ["shop", "market", "outlet"],
    "wordFamily": { "noun": ["store", "storage"], "verb": ["store"] }
  },
  "w_b3_85": {
    "synonyms": ["shopping center", "plaza", "arcade"],
    "wordFamily": { "noun": ["mall"] }
  },
  "w_b3_86": {
    "synonyms": ["gymnasium", "health club", "fitness center"],
    "wordFamily": { "noun": ["gym", "gymnastics", "gymnast"], "adj": ["gymnastic"] }
  },
  "w_b3_87": {
    "synonyms": ["swimming pool", "pond", "basin"],
    "wordFamily": { "noun": ["pool"], "verb": ["pool"] }
  },
  "w_b3_88": {
    "synonyms": ["arid", "parched", "dehydrated"],
    "wordFamily": { "noun": ["dryness"], "verb": ["dry"], "adj": ["dry"], "adv": ["dryly"] }
  },
  "w_b3_89": {
    "synonyms": ["damp", "moist", "soaked"],
    "wordFamily": { "noun": ["wetness"], "verb": ["wet"], "adj": ["wet"] }
  },
  "w_b3_90": {
    "synonyms": ["shining", "brilliant", "luminous"],
    "wordFamily": { "noun": ["brightness"], "verb": ["brighten"], "adj": ["bright"], "adv": ["brightly"] }
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
console.log('Enrichment for Band 3 Batch 9 completed successfully.');
