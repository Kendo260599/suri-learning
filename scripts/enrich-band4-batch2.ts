import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_11": {
    "synonyms": ["plan", "policy", "approach"],
    "wordFamily": { "noun": ["strategy", "strategist"], "verb": ["strategize"], "adj": ["strategic"], "adv": ["strategically"] }
  },
  "w_b4_12": {
    "synonyms": ["goal", "aim", "target"],
    "wordFamily": { "noun": ["objective", "objectivity"], "adj": ["objective"], "adv": ["objectively"] }
  },
  "w_b4_13": {
    "synonyms": ["preference", "precedence", "urgency"],
    "wordFamily": { "noun": ["priority", "prioritization"], "verb": ["prioritize"], "adj": ["prior"] }
  },
  "w_b4_14": {
    "synonyms": ["need", "demand", "condition"],
    "wordFamily": { "noun": ["requirement"], "verb": ["require"], "adj": ["required"] }
  },
  "w_b4_15": {
    "synonyms": ["duty", "obligation", "accountability"],
    "wordFamily": { "noun": ["responsibility"], "adj": ["responsible", "irresponsible"], "adv": ["responsibly"] }
  },
  "w_b4_16": {
    "synonyms": ["criterion", "benchmark", "level"],
    "wordFamily": { "noun": ["standard", "standardization"], "verb": ["standardize"], "adj": ["standard"] }
  },
  "w_b4_17": {
    "synonyms": ["tendency", "movement", "direction"],
    "wordFamily": { "noun": ["trend"], "verb": ["trend"], "adj": ["trendy"] }
  },
  "w_b4_18": {
    "synonyms": ["funding", "backing", "contribution"],
    "wordFamily": { "noun": ["investment", "investor"], "verb": ["invest"] }
  },
  "w_b4_19": {
    "synonyms": ["gain", "earnings", "revenue"],
    "wordFamily": { "noun": ["profit", "profitability"], "verb": ["profit"], "adj": ["profitable"], "adv": ["profitably"] }
  },
  "w_b4_20": {
    "synonyms": ["deficit", "depletion", "forfeiture"],
    "wordFamily": { "noun": ["loss", "loser"], "verb": ["lose"], "adj": ["lost"] }
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
console.log('Enrichment for Band 4 Batch 2 completed successfully.');
