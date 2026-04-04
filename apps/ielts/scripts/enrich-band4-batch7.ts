import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_61": {
    "synonyms": ["branch", "division", "affiliate"],
    "wordFamily": { "noun": ["subsidiary"], "verb": ["subsidize"], "adj": ["subsidiary"] }
  },
  "w_b4_62": {
    "synonyms": ["corporation", "multinational", "group"],
    "wordFamily": { "noun": ["conglomerate", "conglomeration"], "verb": ["conglomerate"] }
  },
  "w_b4_63": {
    "synonyms": ["enterprise", "undertaking", "project"],
    "wordFamily": { "noun": ["venture"], "verb": ["venture"], "adj": ["venturesome"] }
  },
  "w_b4_64": {
    "synonyms": ["stockholder", "investor", "owner"],
    "wordFamily": { "noun": ["shareholder", "shareholding"] }
  },
  "w_b4_65": {
    "synonyms": ["investor", "partner", "participant"],
    "wordFamily": { "noun": ["stakeholder"] }
  },
  "w_b4_66": {
    "synonyms": ["liability", "obligation", "arrears"],
    "wordFamily": { "noun": ["debt", "debtor"], "adj": ["indebted"] }
  },
  "w_b4_67": {
    "synonyms": ["spending", "expense", "cost"],
    "wordFamily": { "noun": ["expenditure"], "verb": ["expend"] }
  },
  "w_b4_68": {
    "synonyms": ["shortfall", "shortage", "loss"],
    "wordFamily": { "noun": ["deficit"] }
  },
  "w_b4_69": {
    "synonyms": ["excess", "overabundance", "remainder"],
    "wordFamily": { "noun": ["surplus"], "adj": ["surplus"] }
  },
  "w_b4_70": {
    "synonyms": ["collection", "profile", "dossier"],
    "wordFamily": { "noun": ["portfolio"] }
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
console.log('Enrichment for Band 4 Batch 7 completed successfully.');
