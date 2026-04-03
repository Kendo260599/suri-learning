import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_101": {
    "synonyms": ["include", "contain", "entail"],
    "wordFamily": { "noun": ["involvement"], "verb": ["involve"], "adj": ["involved"] }
  },
  "w_b5_102": {
    "synonyms": ["separate", "detach", "segregate"],
    "wordFamily": { "noun": ["isolation", "isolationism"], "verb": ["isolate"], "adj": ["isolated", "isolating"] }
  },
  "w_b5_103": {
    "synonyms": ["procedure", "technique", "approach"],
    "wordFamily": { "noun": ["method", "methodology"], "adj": ["methodical"], "adv": ["methodically"] }
  },
  "w_b5_104": {
    "synonyms": ["relocate", "move", "emigrate"],
    "wordFamily": { "noun": ["migration", "migrant"], "verb": ["migrate"], "adj": ["migratory"] }
  },
  "w_b5_105": {
    "synonyms": ["armed forces", "army", "defense"],
    "wordFamily": { "noun": ["military", "militarism"], "verb": ["militarize"], "adj": ["military", "militaristic"], "adv": ["militarily"] }
  },
  "w_b5_106": {
    "synonyms": ["minimum", "slight", "negligible"],
    "wordFamily": { "noun": ["minimum"], "verb": ["minimize"], "adj": ["minimal"], "adv": ["minimally"] }
  },
  "w_b5_107": {
    "synonyms": ["reduce", "decrease", "curtail"],
    "wordFamily": { "noun": ["minimization"], "verb": ["minimize"] }
  },
  "w_b5_108": {
    "synonyms": ["department", "office", "bureau"],
    "wordFamily": { "noun": ["ministry", "minister"], "verb": ["minister"], "adj": ["ministerial"] }
  },
  "w_b5_109": {
    "synonyms": ["slight", "secondary", "insignificant"],
    "wordFamily": { "noun": ["minor", "minority"], "verb": ["minor"], "adj": ["minor"] }
  },
  "w_b5_110": {
    "synonyms": ["manner", "method", "style"],
    "wordFamily": { "noun": ["mode"], "adj": ["modal"] }
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
    
    const lastPropertyMatch = /"topicId":\\s*"[^"]*"\s*(?=\n\s*})/.exec(entryBlock);
    
    if (lastPropertyMatch) {
      const insertIndex = lastPropertyMatch.index + lastPropertyMatch[0].length;
      const enrichmentStr = `,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
      
      const newEntryBlock = entryBlock.slice(0, insertIndex) + enrichmentStr + entryBlock.slice(insertIndex);
      content = content.replace(entryBlock, newEntryBlock);
    } else {
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
console.log('Enrichment for Band 5 Batch 11 completed successfully.');
