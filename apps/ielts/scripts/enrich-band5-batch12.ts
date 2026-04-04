import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_111": {
    "synonyms": ["adjust", "alter", "amend"],
    "wordFamily": { "noun": ["modification", "modifier"], "verb": ["modify"], "adj": ["modifiable"] }
  },
  "w_b5_112": {
    "synonyms": ["observe", "track", "supervise"],
    "wordFamily": { "noun": ["monitor", "monitoring"], "verb": ["monitor"] }
  },
  "w_b5_113": {
    "synonyms": ["revise", "correct", "amend"],
    "wordFamily": { "noun": ["editor", "edition", "editing"], "verb": ["edit"], "adj": ["editorial"] }
  },
  "w_b5_114": {
    "synonyms": ["property", "land", "assets"],
    "wordFamily": { "noun": ["estate"] }
  },
  "w_b5_115": {
    "synonyms": ["keep", "maintain", "preserve"],
    "wordFamily": { "noun": ["retention", "retainer"], "verb": ["retain"], "adj": ["retentive"] }
  },
  "w_b5_116": {
    "synonyms": ["situation", "circumstance", "setup"],
    "wordFamily": { "noun": ["scenario"] }
  },
  "w_b5_117": {
    "synonyms": ["succession", "order", "progression"],
    "wordFamily": { "noun": ["sequence", "sequencing"], "verb": ["sequence"], "adj": ["sequential"], "adv": ["sequentially"] }
  },
  "w_b5_118": {
    "synonyms": ["change", "move", "transfer"],
    "wordFamily": { "noun": ["shift"], "verb": ["shift"], "adj": ["shifty"] }
  },
  "w_b5_119": {
    "synonyms": ["stipulate", "detail", "define"],
    "wordFamily": { "noun": ["specification", "specifics"], "verb": ["specify"], "adj": ["specific"], "adv": ["specifically"] }
  },
  "w_b5_120": {
    "synonyms": ["steadiness", "constancy", "durability"],
    "wordFamily": { "noun": ["stability", "stabilization"], "verb": ["stabilize"], "adj": ["stable", "unstable"] }
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
console.log('Enrichment for Band 5 Batch 12 completed successfully.');
