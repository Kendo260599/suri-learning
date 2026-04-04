import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_181": {
    "synonyms": ["detector", "indicator", "device"],
    "wordFamily": { "noun": ["sensor", "sensitivity", "sensation"], "verb": ["sense"], "adj": ["sensory", "sensitive"], "adv": ["sensitively"] }
  },
  "w_b5_182": {
    "synonyms": ["sagacity", "intelligence", "judgment"],
    "wordFamily": { "noun": ["wisdom"], "adj": ["wise"], "adv": ["wisely"] }
  },
  "w_b5_183": {
    "synonyms": ["aptitude", "skill", "ability"],
    "wordFamily": { "noun": ["talent"], "adj": ["talented"] }
  },
  "w_b5_184": {
    "synonyms": ["present", "donation", "aptitude"],
    "wordFamily": { "noun": ["gift"], "verb": ["gift"], "adj": ["gifted"] }
  },
  "w_b5_185": {
    "synonyms": ["brilliance", "intellect", "mastermind"],
    "wordFamily": { "noun": ["genius"] }
  },
  "w_b5_186": {
    "synonyms": ["acquire", "master", "discover"],
    "wordFamily": { "noun": ["learner", "learning"], "verb": ["learn"], "adj": ["learned"] }
  },
  "w_b5_187": {
    "synonyms": ["research", "investigate", "examine"],
    "wordFamily": { "noun": ["study", "student", "studiousness"], "verb": ["study"], "adj": ["studious"], "adv": ["studiously"] }
  },
  "w_b5_188": {
    "synonyms": ["instruct", "educate", "tutor"],
    "wordFamily": { "noun": ["teacher", "teaching"], "verb": ["teach"] }
  },
  "w_b5_189": {
    "synonyms": ["coach", "drill", "prepare"],
    "wordFamily": { "noun": ["trainer", "trainee", "training"], "verb": ["train"] }
  },
  "w_b5_190": {
    "synonyms": ["exercise", "drill", "rehearsal"],
    "wordFamily": { "noun": ["practice", "practitioner"], "verb": ["practice", "practise"], "adj": ["practical", "practiced"], "adv": ["practically"] }
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
console.log('Enrichment for Band 5 Batch 19 completed successfully.');
