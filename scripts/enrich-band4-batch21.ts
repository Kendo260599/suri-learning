import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_201": {
    "synonyms": ["accurate", "correct", "genuine"],
    "wordFamily": { "noun": ["truth"], "adj": ["true"], "adv": ["truly"] }
  },
  "w_b4_202": {
    "synonyms": ["incorrect", "untrue", "bogus"],
    "wordFamily": { "noun": ["falsity", "falsehood"], "verb": ["falsify"], "adj": ["false"], "adv": ["falsely"] }
  },
  "w_b4_203": {
    "synonyms": ["untruth", "falsehood", "fib"],
    "wordFamily": { "noun": ["lie", "liar"], "verb": ["lie"] }
  },
  "w_b4_204": {
    "synonyms": ["mistake", "fault", "blunder"],
    "wordFamily": { "noun": ["error"], "adj": ["erroneous"], "adv": ["erroneously"] }
  },
  "w_b4_205": {
    "synonyms": ["error", "fault", "slip"],
    "wordFamily": { "noun": ["mistake"], "adj": ["mistaken"], "adv": ["mistakenly"] }
  },
  "w_b4_206": {
    "synonyms": ["accurate", "right", "proper"],
    "wordFamily": { "noun": ["correction", "correctness"], "verb": ["correct"], "adj": ["correct", "corrective"], "adv": ["correctly"] }
  },
  "w_b4_207": {
    "synonyms": ["wrong", "erroneous", "false"],
    "wordFamily": { "noun": ["incorrectness"], "adj": ["incorrect"], "adv": ["incorrectly"] }
  },
  "w_b4_208": {
    "synonyms": ["ponder", "consider", "reflect"],
    "wordFamily": { "noun": ["thought", "thinker"], "verb": ["think"], "adj": ["thoughtful", "thoughtless"], "adv": ["thoughtfully"] }
  },
  "w_b4_209": {
    "synonyms": ["trust", "accept", "rely on"],
    "wordFamily": { "noun": ["belief", "believer"], "verb": ["believe"], "adj": ["believable", "unbelievable"], "adv": ["believably"] }
  },
  "w_b4_210": {
    "synonyms": ["understand", "recognize", "comprehend"],
    "wordFamily": { "noun": ["knowledge"], "verb": ["know"], "adj": ["knowing", "knowledgeable"], "adv": ["knowingly", "knowledgeably"] }
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
console.log('Enrichment for Band 4 Batch 21 completed successfully.');
