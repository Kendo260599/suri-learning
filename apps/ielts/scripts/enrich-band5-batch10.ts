import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_91": {
    "synonyms": ["enforce", "inflict", "levy"],
    "wordFamily": { "noun": ["imposition"], "verb": ["impose"], "adj": ["imposing"] }
  },
  "w_b5_92": {
    "synonyms": ["motivation", "stimulus", "encouragement"],
    "wordFamily": { "noun": ["incentive"], "verb": ["incentivize"] }
  },
  "w_b5_93": {
    "synonyms": ["occurrence", "prevalence", "frequency"],
    "wordFamily": { "noun": ["incidence", "incident"], "adj": ["incidental"], "adv": ["incidentally"] }
  },
  "w_b5_94": {
    "synonyms": ["inner", "inside", "interior"],
    "wordFamily": { "noun": ["interior"], "adj": ["internal"], "adv": ["internally"] }
  },
  "w_b5_95": {
    "synonyms": ["translate", "decipher", "explain"],
    "wordFamily": { "noun": ["interpretation", "interpreter"], "verb": ["interpret"], "adj": ["interpretive"] }
  },
  "w_b5_96": {
    "synonyms": ["period", "gap", "break"],
    "wordFamily": { "noun": ["interval"] }
  },
  "w_b5_97": {
    "synonyms": ["intercede", "mediate", "step in"],
    "wordFamily": { "noun": ["intervention"], "verb": ["intervene"], "adj": ["interventional"] }
  },
  "w_b5_98": {
    "synonyms": ["fund", "finance", "spend"],
    "wordFamily": { "noun": ["investment", "investor"], "verb": ["invest"] }
  },
  "w_b5_99": {
    "synonyms": ["examine", "inspect", "scrutinize"],
    "wordFamily": { "noun": ["investigation", "investigator"], "verb": ["investigate"], "adj": ["investigative"] }
  },
  "w_b5_100": {
    "synonyms": ["summon", "cite", "apply"],
    "wordFamily": { "noun": ["invocation"], "verb": ["invoke"] }
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
console.log('Enrichment for Band 5 Batch 10 completed successfully.');
