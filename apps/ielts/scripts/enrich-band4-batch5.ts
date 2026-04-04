import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_41": {
    "synonyms": ["expansion", "increase", "rise"],
    "wordFamily": { "noun": ["inflation"], "verb": ["inflate"], "adj": ["inflationary", "inflated"] }
  },
  "w_b4_42": {
    "synonyms": ["downturn", "slump", "depression"],
    "wordFamily": { "noun": ["recession"], "verb": ["recede"], "adj": ["recessionary"] }
  },
  "w_b4_43": {
    "synonyms": ["insolvency", "ruin", "failure"],
    "wordFamily": { "noun": ["bankruptcy", "bankrupt"], "verb": ["bankrupt"], "adj": ["bankrupt"] }
  },
  "w_b4_44": {
    "synonyms": ["grant", "allowance", "contribution"],
    "wordFamily": { "noun": ["subsidy"], "verb": ["subsidize"], "adj": ["subsidized"] }
  },
  "w_b4_45": {
    "synonyms": ["tax", "duty", "toll"],
    "wordFamily": { "noun": ["tariff"] }
  },
  "w_b4_46": {
    "synonyms": ["allocation", "allowance", "share"],
    "wordFamily": { "noun": ["quota"] }
  },
  "w_b4_47": {
    "synonyms": ["amalgamation", "consolidation", "fusion"],
    "wordFamily": { "noun": ["merger"], "verb": ["merge"] }
  },
  "w_b4_48": {
    "synonyms": ["purchase", "procurement", "takeover"],
    "wordFamily": { "noun": ["acquisition"], "verb": ["acquire"], "adj": ["acquisitive"] }
  },
  "w_b4_49": {
    "synonyms": ["cooperation", "collaboration", "teamwork"],
    "wordFamily": { "noun": ["synergy"], "verb": ["synergize"], "adj": ["synergistic"], "adv": ["synergistically"] }
  },
  "w_b4_50": {
    "synonyms": ["control", "domination", "cartel"],
    "wordFamily": { "noun": ["monopoly", "monopolist"], "verb": ["monopolize"], "adj": ["monopolistic"] }
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
console.log('Enrichment for Band 4 Batch 5 completed successfully.');
