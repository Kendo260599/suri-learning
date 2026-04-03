import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_21": {
    "synonyms": ["bazaar", "exchange", "marketplace"],
    "wordFamily": { "noun": ["market", "marketer", "marketing"], "verb": ["market"], "adj": ["marketable"] }
  },
  "w_b4_22": {
    "synonyms": ["rivalry", "contest", "championship"],
    "wordFamily": { "noun": ["competition", "competitor"], "verb": ["compete"], "adj": ["competitive"], "adv": ["competitively"] }
  },
  "w_b4_23": {
    "synonyms": ["administration", "control", "direction"],
    "wordFamily": { "noun": ["management", "manager"], "verb": ["manage"], "adj": ["manageable", "managerial"] }
  },
  "w_b4_24": {
    "synonyms": ["guidance", "direction", "authority"],
    "wordFamily": { "noun": ["leadership", "leader"], "verb": ["lead"], "adj": ["leading"] }
  },
  "w_b4_25": {
    "synonyms": ["efficacy", "success", "potency"],
    "wordFamily": { "noun": ["effectiveness", "effect"], "verb": ["effect"], "adj": ["effective", "ineffective"], "adv": ["effectively"] }
  },
  "w_b4_26": {
    "synonyms": ["adaptability", "versatility", "elasticity"],
    "wordFamily": { "noun": ["flexibility"], "adj": ["flexible", "inflexible"], "adv": ["flexibly"] }
  },
  "w_b4_27": {
    "synonyms": ["discussion", "bargaining", "mediation"],
    "wordFamily": { "noun": ["negotiation", "negotiator"], "verb": ["negotiate"], "adj": ["negotiable"] }
  },
  "w_b4_28": {
    "synonyms": ["promotion", "selling", "advertising"],
    "wordFamily": { "noun": ["marketing", "market", "marketer"], "verb": ["market"], "adj": ["marketable"] }
  },
  "w_b4_29": {
    "synonyms": ["promotion", "commercials", "publicity"],
    "wordFamily": { "noun": ["advertising", "advertisement", "advertiser"], "verb": ["advertise"] }
  },
  "w_b4_30": {
    "synonyms": ["businessman", "businesswoman", "founder"],
    "wordFamily": { "noun": ["entrepreneur", "entrepreneurship"], "adj": ["entrepreneurial"] }
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
console.log('Enrichment for Band 4 Batch 3 completed successfully.');
