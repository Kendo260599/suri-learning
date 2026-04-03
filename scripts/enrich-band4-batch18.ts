import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_171": {
    "synonyms": ["relic", "remains", "petrified"],
    "wordFamily": { "noun": ["fossil", "fossilization"], "verb": ["fossilize"], "adj": ["fossilized"] }
  },
  "w_b4_172": {
    "synonyms": ["propellant", "energy source", "combustible"],
    "wordFamily": { "noun": ["fuel", "refueling"], "verb": ["fuel", "refuel"] }
  },
  "w_b4_173": {
    "synonyms": ["environmental science", "bionomics"],
    "wordFamily": { "noun": ["ecology", "ecologist"], "adj": ["ecological"], "adv": ["ecologically"] }
  },
  "w_b4_174": {
    "synonyms": ["conservation", "maintenance", "protection"],
    "wordFamily": { "noun": ["preservation", "preservative"], "verb": ["preserve"], "adj": ["preservable"] }
  },
  "w_b4_175": {
    "synonyms": ["defense", "safeguard", "security"],
    "wordFamily": { "noun": ["protection", "protector", "protectiveness"], "verb": ["protect"], "adj": ["protective"], "adv": ["protectively"] }
  },
  "w_b4_176": {
    "synonyms": ["origin", "root", "derivation"],
    "wordFamily": { "noun": ["source"], "verb": ["source"] }
  },
  "w_b4_177": {
    "synonyms": ["provision", "stock", "inventory"],
    "wordFamily": { "noun": ["supply", "supplier"], "verb": ["supply"] }
  },
  "w_b4_178": {
    "synonyms": ["request", "requirement", "need"],
    "wordFamily": { "noun": ["demand"], "verb": ["demand"], "adj": ["demanding"] }
  },
  "w_b4_179": {
    "synonyms": ["usage", "utilization", "depletion"],
    "wordFamily": { "noun": ["consumption", "consumer", "consumable"], "verb": ["consume"], "adj": ["consumable"] }
  },
  "w_b4_180": {
    "synonyms": ["impact", "result", "consequence"],
    "wordFamily": { "noun": ["effect", "effectiveness", "efficacy"], "verb": ["effect"], "adj": ["effective", "effectual"], "adv": ["effectively"] }
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
console.log('Enrichment for Band 4 Batch 18 completed successfully.');
