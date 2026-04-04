import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_161": {
    "synonyms": ["interest", "benefit", "stead"],
    "wordFamily": { "noun": ["behalf"] }
  },
  "w_b4_162": {
    "synonyms": ["reprocess", "reuse", "reclaim"],
    "wordFamily": { "noun": ["recycling", "recyclability"], "verb": ["recycle"], "adj": ["recyclable"] }
  },
  "w_b4_163": {
    "synonyms": ["power", "vigor", "force"],
    "wordFamily": { "noun": ["energy", "energizer"], "verb": ["energize"], "adj": ["energetic"], "adv": ["energetically"] }
  },
  "w_b4_164": {
    "synonyms": ["fauna", "nature"],
    "wordFamily": { "noun": ["wildlife"] }
  },
  "w_b4_165": {
    "synonyms": ["sun-related", "heliocentric"],
    "wordFamily": { "noun": ["solarization"], "verb": ["solarize"], "adj": ["solar"] }
  },
  "w_b4_166": {
    "synonyms": ["graphite", "charcoal"],
    "wordFamily": { "noun": ["carbon", "carbonate", "carbonization"], "verb": ["carbonize"], "adj": ["carbonic", "carbonaceous"] }
  },
  "w_b4_167": {
    "synonyms": ["discharge", "release", "outflow"],
    "wordFamily": { "noun": ["emission", "emitter"], "verb": ["emit"] }
  },
  "w_b4_168": {
    "synonyms": ["worldwide", "international", "universal"],
    "wordFamily": { "noun": ["globe", "globalization"], "verb": ["globalize"], "adj": ["global"], "adv": ["globally"] }
  },
  "w_b4_169": {
    "synonyms": ["heating", "thawing"],
    "wordFamily": { "noun": ["warmth", "warming"], "verb": ["warm"], "adj": ["warm"], "adv": ["warmly"] }
  },
  "w_b4_170": {
    "synonyms": ["glasshouse", "conservatory"],
    "wordFamily": { "noun": ["greenhouse"] }
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
console.log('Enrichment for Band 4 Batch 17 completed successfully.');
