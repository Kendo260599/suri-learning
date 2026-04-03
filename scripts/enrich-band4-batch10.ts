import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_91": {
    "synonyms": ["emphasize", "underline", "spotlight"],
    "wordFamily": { "noun": ["highlight"], "verb": ["highlight"] }
  },
  "w_b4_92": {
    "synonyms": ["exact", "indistinguishable", "matching"],
    "wordFamily": { "noun": ["identity", "identification"], "verb": ["identify"], "adj": ["identical"], "adv": ["identically"] }
  },
  "w_b4_93": {
    "synonyms": ["uneducated", "uninformed", "unaware"],
    "wordFamily": { "noun": ["ignorance"], "verb": ["ignore"], "adj": ["ignorant"], "adv": ["ignorantly"] }
  },
  "w_b4_94": {
    "synonyms": ["demonstrate", "exemplify", "depict"],
    "wordFamily": { "noun": ["illustration", "illustrator"], "verb": ["illustrate"], "adj": ["illustrative"] }
  },
  "w_b4_95": {
    "synonyms": ["example", "case", "occurrence"],
    "wordFamily": { "noun": ["instance"] }
  },
  "w_b4_96": {
    "synonyms": ["organization", "academy", "foundation"],
    "wordFamily": { "noun": ["institute", "institution"], "verb": ["institute"], "adj": ["institutional"] }
  },
  "w_b4_97": {
    "synonyms": ["teach", "direct", "command"],
    "wordFamily": { "noun": ["instruction", "instructor"], "verb": ["instruct"], "adj": ["instructive"] }
  },
  "w_b4_98": {
    "synonyms": ["essential", "fundamental", "intrinsic"],
    "wordFamily": { "noun": ["integrity", "integration"], "verb": ["integrate"], "adj": ["integral"], "adv": ["integrally"] }
  },
  "w_b4_99": {
    "synonyms": ["combine", "incorporate", "merge"],
    "wordFamily": { "noun": ["integration"], "verb": ["integrate"], "adj": ["integrated"] }
  },
  "w_b4_100": {
    "synonyms": ["extreme", "severe", "fierce"],
    "wordFamily": { "noun": ["intensity", "intensification"], "verb": ["intensify"], "adj": ["intense", "intensive"], "adv": ["intensely", "intensively"] }
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
console.log('Enrichment for Band 4 Batch 10 completed successfully.');
