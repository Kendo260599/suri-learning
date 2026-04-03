import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_141": {
    "synonyms": ["hideous", "unsightly", "repulsive"],
    "wordFamily": { "noun": ["ugliness"], "adj": ["ugly"] }
  },
  "w_b2_142": {
    "synonyms": ["spotless", "immaculate", "hygienic"],
    "wordFamily": { "noun": ["cleanliness", "cleaner"], "verb": ["clean"], "adj": ["clean"], "adv": ["cleanly"] }
  },
  "w_b2_143": {
    "synonyms": ["filthy", "grimy", "soiled"],
    "wordFamily": { "noun": ["dirt", "dirtiness"], "verb": ["dirty"], "adj": ["dirty"], "adv": ["dirtily"] }
  },
  "w_b2_144": {
    "synonyms": ["vacant", "unoccupied", "void"],
    "wordFamily": { "noun": ["emptiness"], "verb": ["empty"], "adj": ["empty"] }
  },
  "w_b2_145": {
    "synonyms": ["filled", "packed", "brimming"],
    "wordFamily": { "noun": ["fullness"], "adj": ["full"], "adv": ["fully"] }
  },
  "w_b2_146": {
    "synonyms": ["recent", "modern", "novel"],
    "wordFamily": { "noun": ["newness", "newcomer"], "adj": ["new"], "adv": ["newly"] }
  },
  "w_b2_147": {
    "synonyms": ["contemporary", "current", "up-to-date"],
    "wordFamily": { "noun": ["modernity", "modernization"], "verb": ["modernize"], "adj": ["modern"] }
  },
  "w_b2_148": {
    "synonyms": ["antique", "archaic", "primeval"],
    "wordFamily": { "noun": ["antiquity"], "adj": ["ancient"] }
  },
  "w_b2_149": {
    "synonyms": ["conventional", "customary", "established"],
    "wordFamily": { "noun": ["tradition"], "adj": ["traditional"], "adv": ["traditionally"] }
  },
  "w_b2_150": {
    "synonyms": ["renowned", "celebrated", "well-known"],
    "wordFamily": { "noun": ["fame"], "adj": ["famous"], "adv": ["famously"] }
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
console.log('Enrichment for Band 2 Batch 15 completed successfully.');
