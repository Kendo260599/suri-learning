import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_171": {
    "synonyms": ["hue", "shade", "tint"],
    "wordFamily": { "noun": ["color", "coloring"], "verb": ["color"], "adj": ["colorful", "colorless"] }
  },
  "w_b2_172": {
    "synonyms": ["design", "motif", "arrangement"],
    "wordFamily": { "noun": ["pattern"], "verb": ["pattern"], "adj": ["patterned"] }
  },
  "w_b2_173": {
    "synonyms": ["dense", "heavy", "chunky"],
    "wordFamily": { "noun": ["thickness"], "verb": ["thicken"], "adj": ["thick"], "adv": ["thickly"] }
  },
  "w_b2_174": {
    "synonyms": ["slender", "slim", "narrow"],
    "wordFamily": { "noun": ["thinness"], "verb": ["thin"], "adj": ["thin"], "adv": ["thinly"] }
  },
  "w_b2_175": {
    "synonyms": ["broad", "extensive", "spacious"],
    "wordFamily": { "noun": ["width"], "verb": ["widen"], "adj": ["wide"], "adv": ["widely"] }
  },
  "w_b2_176": {
    "synonyms": ["slim", "slender", "tight"],
    "wordFamily": { "noun": ["narrowness"], "verb": ["narrow"], "adj": ["narrow"], "adv": ["narrowly"] }
  },
  "w_b2_177": {
    "synonyms": ["profound", "bottomless", "intense"],
    "wordFamily": { "noun": ["depth"], "verb": ["deepen"], "adj": ["deep"], "adv": ["deeply"] }
  },
  "w_b2_178": {
    "synonyms": ["superficial", "surface", "empty"],
    "wordFamily": { "noun": ["shallowness"], "adj": ["shallow"], "adv": ["shallowly"] }
  },
  "w_b2_179": {
    "synonyms": ["tall", "elevated", "lofty"],
    "wordFamily": { "noun": ["height"], "verb": ["heighten"], "adj": ["high"], "adv": ["highly"] }
  },
  "w_b2_180": {
    "synonyms": ["short", "small", "depressed"],
    "wordFamily": { "noun": ["lowness"], "verb": ["lower"], "adj": ["low"], "adv": ["lowly"] }
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
console.log('Enrichment for Band 2 Batch 18 completed successfully.');
