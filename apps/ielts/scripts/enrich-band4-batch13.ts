import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_121": {
    "synonyms": ["distinguish", "differentiate", "prejudice"],
    "wordFamily": { "noun": ["discrimination"], "verb": ["discriminate"], "adj": ["discriminatory", "discriminating"] }
  },
  "w_b4_122": {
    "synonyms": ["exhibit", "show", "present"],
    "wordFamily": { "noun": ["display"], "verb": ["display"] }
  },
  "w_b4_123": {
    "synonyms": ["various", "different", "varied"],
    "wordFamily": { "noun": ["diversity", "diversification"], "verb": ["diversify"], "adj": ["diverse"], "adv": ["diversely"] }
  },
  "w_b4_124": {
    "synonyms": ["result", "consequence", "conclusion"],
    "wordFamily": { "noun": ["outcome"] }
  },
  "w_b4_125": {
    "synonyms": ["aligned", "similar", "equivalent"],
    "wordFamily": { "noun": ["parallel"], "verb": ["parallel"], "adj": ["parallel"] }
  },
  "w_b4_126": {
    "synonyms": ["variable", "factor", "criterion"],
    "wordFamily": { "noun": ["parameter"], "adj": ["parametric"] }
  },
  "w_b4_127": {
    "synonyms": ["stage", "period", "chapter"],
    "wordFamily": { "noun": ["phase"], "verb": ["phase"] }
  },
  "w_b4_128": {
    "synonyms": ["forecast", "foresee", "anticipate"],
    "wordFamily": { "noun": ["prediction", "predictability"], "verb": ["predict"], "adj": ["predictable", "unpredictable"], "adv": ["predictably"] }
  },
  "w_b4_129": {
    "synonyms": ["main", "primary", "chief"],
    "wordFamily": { "noun": ["principal"], "adj": ["principal"], "adv": ["principally"] }
  },
  "w_b4_130": {
    "synonyms": ["previous", "preceding", "earlier"],
    "wordFamily": { "noun": ["priority"], "verb": ["prioritize"], "adj": ["prior"] }
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
console.log('Enrichment for Band 4 Batch 13 completed successfully.');
