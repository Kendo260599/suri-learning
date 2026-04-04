import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b3_101": {
    "synonyms": ["instructor", "director", "leader"],
    "wordFamily": { "noun": ["guide", "guidance"], "verb": ["guide"], "adj": ["guided"] }
  },
  "w_b3_102": {
    "synonyms": ["regional", "native", "resident"],
    "wordFamily": { "noun": ["local", "locality", "localization"], "verb": ["localize"], "adj": ["local"], "adv": ["locally"] }
  },
  "w_b3_103": {
    "synonyms": ["tradition", "practice", "habit"],
    "wordFamily": { "noun": ["custom", "customer"], "verb": ["customize"], "adj": ["customary"], "adv": ["customarily"] }
  },
  "w_b3_104": {
    "synonyms": ["carnival", "gala", "fete"],
    "wordFamily": { "noun": ["festival", "festivity"], "adj": ["festive"], "adv": ["festively"] }
  },
  "w_b3_105": {
    "synonyms": ["party", "commemoration", "observance"],
    "wordFamily": { "noun": ["celebration", "celebrity"], "verb": ["celebrate"], "adj": ["celebratory"] }
  },
  "w_b3_106": {
    "synonyms": ["vacation", "break", "recess"],
    "wordFamily": { "noun": ["holiday"], "verb": ["holiday"] }
  },
  "w_b3_107": {
    "synonyms": ["holiday", "break", "leave"],
    "wordFamily": { "noun": ["vacation"], "verb": ["vacate", "vacation"], "adj": ["vacant"] }
  },
  "w_b3_108": {
    "synonyms": ["guest", "caller", "tourist"],
    "wordFamily": { "noun": ["visitor", "visit"], "verb": ["visit"] }
  },
  "w_b3_109": {
    "synonyms": ["visitor", "caller", "company"],
    "wordFamily": { "noun": ["guest"] }
  },
  "w_b3_110": {
    "synonyms": ["presenter", "entertainer", "emcee"],
    "wordFamily": { "noun": ["host", "hostess"], "verb": ["host"] }
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
console.log('Enrichment for Band 3 Batch 11 completed successfully.');
