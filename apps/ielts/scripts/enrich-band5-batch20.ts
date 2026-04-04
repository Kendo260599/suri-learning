import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_191": {
    "synonyms": ["evolve", "expand", "advance"],
    "wordFamily": { "noun": ["development", "developer"], "verb": ["develop"], "adj": ["developing", "developed"] }
  },
  "w_b5_192": {
    "synonyms": ["expand", "increase", "flourish"],
    "wordFamily": { "noun": ["growth"], "verb": ["grow"], "adj": ["growing", "grown"] }
  },
  "w_b5_193": {
    "synonyms": ["alter", "modify", "transform"],
    "wordFamily": { "noun": ["change"], "verb": ["change"], "adj": ["changeable", "changed"] }
  },
  "w_b5_194": {
    "synonyms": ["concur", "consent", "accept"],
    "wordFamily": { "noun": ["agreement"], "verb": ["agree"], "adj": ["agreeable"] }
  },
  "w_b5_195": {
    "synonyms": ["differ", "dissent", "object"],
    "wordFamily": { "noun": ["disagreement"], "verb": ["disagree"], "adj": ["disagreeable"] }
  },
  "w_b5_196": {
    "synonyms": ["quarrel", "dispute", "contend"],
    "wordFamily": { "noun": ["argument"], "verb": ["argue"], "adj": ["arguable"], "adv": ["arguably"] }
  },
  "w_b5_197": {
    "synonyms": ["talk over", "debate", "examine"],
    "wordFamily": { "noun": ["discussion"], "verb": ["discuss"] }
  },
  "w_b5_198": {
    "synonyms": ["discussion", "argument", "dispute"],
    "wordFamily": { "noun": ["debate", "debater"], "verb": ["debate"], "adj": ["debatable"] }
  },
  "w_b5_199": {
    "synonyms": ["convince", "induce", "influence"],
    "wordFamily": { "noun": ["persuasion"], "verb": ["persuade"], "adj": ["persuasive"], "adv": ["persuasively"] }
  },
  "w_b5_200": {
    "synonyms": ["persuade", "assure", "satisfy"],
    "wordFamily": { "noun": ["conviction"], "verb": ["convince"], "adj": ["convinced", "convincing"], "adv": ["convincingly"] }
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
console.log('Enrichment for Band 5 Batch 20 completed successfully.');
