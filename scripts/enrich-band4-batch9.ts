import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_81": {
    "synonyms": ["display", "show", "demonstrate"],
    "wordFamily": { "noun": ["exhibit", "exhibition", "exhibitor"], "verb": ["exhibit"] }
  },
  "w_b4_82": {
    "synonyms": ["enlarge", "grow", "extend"],
    "wordFamily": { "noun": ["expansion", "expanse"], "verb": ["expand"], "adj": ["expansive", "expandable"] }
  },
  "w_b4_83": {
    "synonyms": ["specialist", "authority", "professional"],
    "wordFamily": { "noun": ["expert", "expertise"], "adj": ["expert"], "adv": ["expertly"] }
  },
  "w_b4_84": {
    "synonyms": ["utilize", "harness", "abuse"],
    "wordFamily": { "noun": ["exploitation", "exploiter"], "verb": ["exploit"], "adj": ["exploitative"] }
  },
  "w_b4_85": {
    "synonyms": ["sell overseas", "trade internationally", "ship out"],
    "wordFamily": { "noun": ["export", "exporter", "exportation"], "verb": ["export"] }
  },
  "w_b4_86": {
    "synonyms": ["reveal", "uncover", "disclose"],
    "wordFamily": { "noun": ["exposure"], "verb": ["expose"], "adj": ["exposed"] }
  },
  "w_b4_87": {
    "synonyms": ["warranty", "assurance", "promise"],
    "wordFamily": { "noun": ["guarantee", "guarantor"], "verb": ["guarantee"] }
  },
  "w_b4_88": {
    "synonyms": ["rule", "instruction", "direction"],
    "wordFamily": { "noun": ["guideline", "guide", "guidance"], "verb": ["guide"] }
  },
  "w_b4_89": {
    "synonyms": ["therefore", "thus", "consequently"],
    "wordFamily": {}
  },
  "w_b4_90": {
    "synonyms": ["pecking order", "ranking", "chain of command"],
    "wordFamily": { "noun": ["hierarchy"], "adj": ["hierarchical"], "adv": ["hierarchically"] }
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
console.log('Enrichment for Band 4 Batch 9 completed successfully.');
