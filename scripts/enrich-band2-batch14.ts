import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_131": {
    "synonyms": ["silent", "peaceful", "tranquil"],
    "wordFamily": { "noun": ["quiet", "quietness"], "verb": ["quiet", "quieten"], "adj": ["quiet"], "adv": ["quietly"] }
  },
  "w_b2_132": {
    "synonyms": ["loud", "clamorous", "rowdy"],
    "wordFamily": { "noun": ["noise", "noisiness"], "adj": ["noisy"], "adv": ["noisily"] }
  },
  "w_b2_133": {
    "synonyms": ["quick", "rapid", "swift"],
    "wordFamily": { "noun": ["fastness"], "adj": ["fast"], "adv": ["fast"] }
  },
  "w_b2_134": {
    "synonyms": ["leisurely", "sluggish", "unhurried"],
    "wordFamily": { "noun": ["slowness"], "verb": ["slow"], "adj": ["slow"], "adv": ["slowly"] }
  },
  "w_b2_135": {
    "synonyms": ["powerful", "mighty", "robust"],
    "wordFamily": { "noun": ["strength"], "verb": ["strengthen"], "adj": ["strong"], "adv": ["strongly"] }
  },
  "w_b2_136": {
    "synonyms": ["feeble", "frail", "fragile"],
    "wordFamily": { "noun": ["weakness"], "verb": ["weaken"], "adj": ["weak"], "adv": ["weakly"] }
  },
  "w_b2_137": {
    "synonyms": ["wealthy", "affluent", "prosperous"],
    "wordFamily": { "noun": ["richness", "riches"], "verb": ["enrich"], "adj": ["rich"], "adv": ["richly"] }
  },
  "w_b2_138": {
    "synonyms": ["impoverished", "needy", "destitute"],
    "wordFamily": { "noun": ["poverty"], "adj": ["poor"], "adv": ["poorly"] }
  },
  "w_b2_139": {
    "synonyms": ["youthful", "juvenile", "adolescent"],
    "wordFamily": { "noun": ["youth", "youngster"], "adj": ["young", "youthful"] }
  },
  "w_b2_140": {
    "synonyms": ["elderly", "aged", "ancient"],
    "wordFamily": { "noun": ["oldness", "oldie"], "adj": ["old"] }
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
console.log('Enrichment for Band 2 Batch 14 completed successfully.');
