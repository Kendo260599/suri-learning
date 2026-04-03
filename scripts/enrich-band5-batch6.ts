import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b5_51": {
    "synonyms": ["data", "figures", "analytics"],
    "wordFamily": { "noun": ["statistics", "statistician", "statistic"], "adj": ["statistical"], "adv": ["statistically"] }
  },
  "w_b5_52": {
    "synonyms": ["theoretical", "supposed", "conjectural"],
    "wordFamily": { "noun": ["hypothesis"], "adj": ["hypothetical"], "adv": ["hypothetically"] }
  },
  "w_b5_53": {
    "synonyms": ["measurable", "numerical", "statistical"],
    "wordFamily": { "noun": ["quantity"], "adj": ["quantitative"], "adv": ["quantitatively"] }
  },
  "w_b5_54": {
    "synonyms": ["descriptive", "subjective", "interpretive"],
    "wordFamily": { "noun": ["quality"], "adj": ["qualitative"], "adv": ["qualitatively"] }
  },
  "w_b5_55": {
    "synonyms": ["prejudiced", "partial", "one-sided"],
    "wordFamily": { "noun": ["bias"], "verb": ["bias"], "adj": ["biased"] }
  },
  "w_b5_56": {
    "synonyms": ["unbiased", "objective", "disinterested"],
    "wordFamily": { "noun": ["impartiality"], "adj": ["impartial"], "adv": ["impartially"] }
  },
  "w_b5_57": {
    "synonyms": ["dispassionate", "unaligned", "indifferent"],
    "wordFamily": { "noun": ["neutrality"], "verb": ["neutralize"], "adj": ["neutral"], "adv": ["neutrally"] }
  },
  "w_b5_58": {
    "synonyms": ["assessment", "appraisal", "estimation"],
    "wordFamily": { "noun": ["evaluation", "evaluator"], "verb": ["evaluate"], "adj": ["evaluative"] }
  },
  "w_b5_59": {
    "synonyms": ["legitimate", "authentic", "sound"],
    "wordFamily": { "noun": ["validity", "validation"], "verb": ["validate"], "adj": ["valid"], "adv": ["validly"] }
  },
  "w_b5_60": {
    "synonyms": ["null", "void", "unfounded"],
    "wordFamily": { "noun": ["invalidity", "invalid"], "verb": ["invalidate"], "adj": ["invalid"] }
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
console.log('Enrichment for Band 5 Batch 6 completed successfully.');
