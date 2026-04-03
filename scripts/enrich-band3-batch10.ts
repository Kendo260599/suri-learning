import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_91": {
    "synonyms": ["dim", "gloomy", "shadowy"],
    "wordFamily": { "noun": ["darkness", "dark"], "verb": ["darken"], "adj": ["dark"], "adv": ["darkly"] }
  },
  "w_b3_92": {
    "synonyms": ["illumination", "brightness", "pale"],
    "wordFamily": { "noun": ["light", "lightness", "lighting"], "verb": ["light", "lighten"], "adj": ["light"], "adv": ["lightly"] }
  },
  "w_b3_93": {
    "synonyms": ["weighty", "hefty", "dense"],
    "wordFamily": { "noun": ["heaviness"], "adj": ["heavy"], "adv": ["heavily"] }
  },
  "w_b3_94": {
    "synonyms": ["plush", "cushiony", "gentle"],
    "wordFamily": { "noun": ["softness"], "verb": ["soften"], "adj": ["soft"], "adv": ["softly"] }
  },
  "w_b3_95": {
    "synonyms": ["solid", "firm", "difficult"],
    "wordFamily": { "noun": ["hardness", "hardship"], "verb": ["harden"], "adj": ["hard"], "adv": ["hard"] }
  },
  "w_b3_96": {
    "synonyms": ["even", "flat", "sleek"],
    "wordFamily": { "noun": ["smoothness"], "verb": ["smooth"], "adj": ["smooth"], "adv": ["smoothly"] }
  },
  "w_b3_97": {
    "synonyms": ["uneven", "bumpy", "coarse"],
    "wordFamily": { "noun": ["roughness"], "verb": ["roughen"], "adj": ["rough"], "adv": ["roughly"] }
  },
  "w_b3_98": {
    "synonyms": ["journey", "trip", "aviation"],
    "wordFamily": { "noun": ["flight"], "verb": ["fly"] }
  },
  "w_b3_99": {
    "synonyms": ["expedition", "journey", "escapade"],
    "wordFamily": { "noun": ["adventure", "adventurer"], "adj": ["adventurous"], "adv": ["adventurously"] }
  },
  "w_b3_100": {
    "synonyms": ["investigate", "discover", "survey"],
    "wordFamily": { "noun": ["exploration", "explorer"], "verb": ["explore"], "adj": ["exploratory"] }
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
console.log('Enrichment for Band 3 Batch 10 completed successfully.');
