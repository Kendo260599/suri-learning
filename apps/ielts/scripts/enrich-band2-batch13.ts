import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_121": {
    "synonyms": ["cathedral", "chapel", "sanctuary"],
    "wordFamily": { "noun": ["church", "churchgoer"], "adj": ["churchly"] }
  },
  "w_b2_122": {
    "synonyms": ["shrine", "sanctuary", "fane"],
    "wordFamily": { "noun": ["temple"] }
  },
  "w_b2_123": {
    "synonyms": ["masjid"],
    "wordFamily": { "noun": ["mosque"] }
  },
  "w_b2_124": {
    "synonyms": ["arena", "coliseum", "ground"],
    "wordFamily": { "noun": ["stadium"] }
  },
  "w_b2_125": {
    "synonyms": ["cold season", "wintertime"],
    "wordFamily": { "noun": ["winter", "wintertime"], "verb": ["winter"], "adj": ["wintry", "wintery"] }
  },
  "w_b2_126": {
    "synonyms": ["tempest", "gale", "cyclone"],
    "wordFamily": { "noun": ["storm", "storminess"], "verb": ["storm"], "adj": ["stormy"] }
  },
  "w_b2_127": {
    "synonyms": ["courageous", "fearless", "valiant"],
    "wordFamily": { "noun": ["bravery"], "verb": ["brave"], "adj": ["brave"], "adv": ["bravely"] }
  },
  "w_b2_128": {
    "synonyms": ["generous", "considerate", "benevolent"],
    "wordFamily": { "noun": ["kindness"], "adj": ["kind"], "adv": ["kindly"] }
  },
  "w_b2_129": {
    "synonyms": ["sincere", "truthful", "trustworthy"],
    "wordFamily": { "noun": ["honesty"], "adj": ["honest"], "adv": ["honestly"] }
  },
  "w_b2_130": {
    "synonyms": ["intelligent", "smart", "bright"],
    "wordFamily": { "noun": ["cleverness"], "adj": ["clever"], "adv": ["cleverly"] }
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
console.log('Enrichment for Band 2 Batch 13 completed successfully.');
