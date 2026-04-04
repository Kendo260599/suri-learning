import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_1": {
    "synonyms": ["result", "outcome", "effect"],
    "wordFamily": { "noun": ["consequence"], "adj": ["consequent", "consequential"], "adv": ["consequently"] }
  },
  "w_b4_2": {
    "synonyms": ["important", "meaningful", "notable"],
    "wordFamily": { "noun": ["significance"], "verb": ["signify"], "adj": ["significant", "insignificant"], "adv": ["significantly"] }
  },
  "w_b4_3": {
    "synonyms": ["crucial", "vital", "necessary"],
    "wordFamily": { "noun": ["essential", "essence"], "adj": ["essential", "inessential"], "adv": ["essentially"] }
  },
  "w_b4_4": {
    "synonyms": ["basic", "primary", "foundational"],
    "wordFamily": { "noun": ["fundamental"], "adj": ["fundamental"], "adv": ["fundamentally"] }
  },
  "w_b4_5": {
    "synonyms": ["viewpoint", "outlook", "standpoint"],
    "wordFamily": { "noun": ["perspective"] }
  },
  "w_b4_6": {
    "synonyms": ["substitute", "option", "choice"],
    "wordFamily": { "noun": ["alternative"], "verb": ["alternate"], "adj": ["alternative", "alternate"], "adv": ["alternatively"] }
  },
  "w_b4_7": {
    "synonyms": ["benefit", "edge", "superiority"],
    "wordFamily": { "noun": ["advantage"], "verb": ["advantage"], "adj": ["advantageous"], "adv": ["advantageously"] }
  },
  "w_b4_8": {
    "synonyms": ["drawback", "downside", "weakness"],
    "wordFamily": { "noun": ["disadvantage"], "verb": ["disadvantage"], "adj": ["disadvantaged", "disadvantageous"] }
  },
  "w_b4_9": {
    "synonyms": ["effect", "influence", "collision"],
    "wordFamily": { "noun": ["impact"], "verb": ["impact"], "adj": ["impactful"] }
  },
  "w_b4_10": {
    "synonyms": ["effect", "power", "control"],
    "wordFamily": { "noun": ["influence"], "verb": ["influence"], "adj": ["influential"] }
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
console.log('Enrichment for Band 4 Batch 1 completed successfully.');
