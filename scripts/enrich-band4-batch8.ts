import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_71": {
    "synonyms": ["gather", "collect", "amass"],
    "wordFamily": { "noun": ["accumulation"], "verb": ["accumulate"], "adj": ["accumulative"] }
  },
  "w_b4_72": {
    "synonyms": ["sufficient", "enough", "satisfactory"],
    "wordFamily": { "noun": ["adequacy"], "adj": ["adequate", "inadequate"], "adv": ["adequately"] }
  },
  "w_b4_73": {
    "synonyms": ["revise", "alter", "modify"],
    "wordFamily": { "noun": ["amendment"], "verb": ["amend"] }
  },
  "w_b4_74": {
    "synonyms": ["comparison", "parallel", "correlation"],
    "wordFamily": { "noun": ["analogy"], "adj": ["analogous"] }
  },
  "w_b4_75": {
    "synonyms": ["random", "capricious", "subjective"],
    "wordFamily": { "noun": ["arbitrariness"], "adj": ["arbitrary"], "adv": ["arbitrarily"] }
  },
  "w_b4_76": {
    "synonyms": ["feature", "facet", "characteristic"],
    "wordFamily": { "noun": ["aspect"] }
  },
  "w_b4_77": {
    "synonyms": ["evaluate", "judge", "appraise"],
    "wordFamily": { "noun": ["assessment", "assessor"], "verb": ["assess"] }
  },
  "w_b4_78": {
    "synonyms": ["ascribe", "credit", "assign"],
    "wordFamily": { "noun": ["attribute", "attribution"], "verb": ["attribute"], "adj": ["attributable"] }
  },
  "w_b4_79": {
    "synonyms": ["surpass", "outdo", "transcend"],
    "wordFamily": { "noun": ["excess"], "verb": ["exceed"], "adj": ["excessive"], "adv": ["exceedingly"] }
  },
  "w_b4_80": {
    "synonyms": ["omit", "leave out", "reject"],
    "wordFamily": { "noun": ["exclusion"], "verb": ["exclude"], "adj": ["exclusive"], "adv": ["exclusively"] }
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
console.log('Enrichment for Band 4 Batch 8 completed successfully.');
