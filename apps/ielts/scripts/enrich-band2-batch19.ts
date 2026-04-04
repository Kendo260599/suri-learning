import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_181": {
    "synonyms": ["lengthy", "extended", "prolonged"],
    "wordFamily": { "noun": ["length"], "verb": ["lengthen"], "adj": ["long"], "adv": ["long"] }
  },
  "w_b2_182": {
    "synonyms": ["brief", "concise", "little"],
    "wordFamily": { "noun": ["shortness", "shortage"], "verb": ["shorten"], "adj": ["short"], "adv": ["shortly"] }
  },
  "w_b2_183": {
    "synonyms": ["keen", "acute", "pointed"],
    "wordFamily": { "noun": ["sharpness"], "verb": ["sharpen"], "adj": ["sharp"], "adv": ["sharply"] }
  },
  "w_b2_184": {
    "synonyms": ["dull", "unsharpened", "forthright"],
    "wordFamily": { "noun": ["bluntness"], "verb": ["blunt"], "adj": ["blunt"], "adv": ["bluntly"] }
  },
  "w_b2_185": {
    "synonyms": ["delicate", "breakable", "frail"],
    "wordFamily": { "noun": ["fragility"], "adj": ["fragile"] }
  },
  "w_b2_186": {
    "synonyms": ["big", "great", "huge"],
    "wordFamily": { "noun": ["largeness"], "verb": ["enlarge"], "adj": ["large"], "adv": ["largely"] }
  },
  "w_b2_187": {
    "synonyms": ["enormous", "massive", "gigantic"],
    "wordFamily": { "noun": ["hugeness"], "adj": ["huge"], "adv": ["hugely"] }
  },
  "w_b2_188": {
    "synonyms": ["minute", "miniature", "microscopic"],
    "wordFamily": { "noun": ["tininess"], "adj": ["tiny"] }
  },
  "w_b2_189": {
    "synonyms": ["small-scale", "mini", "tiny"],
    "wordFamily": { "noun": ["miniature"], "verb": ["miniaturize"], "adj": ["miniature"] }
  },
  "w_b2_190": {
    "synonyms": ["colossal", "gigantic", "mammoth"],
    "wordFamily": { "noun": ["giant"], "adj": ["giant"] }
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
console.log('Enrichment for Band 2 Batch 19 completed successfully.');
