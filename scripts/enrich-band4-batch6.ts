import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b4_51": {
    "synonyms": ["monopoly", "cartel", "trust"],
    "wordFamily": { "noun": ["oligopoly", "oligopolist"], "adj": ["oligopolistic"] }
  },
  "w_b4_52": {
    "synonyms": ["syndicate", "consortium", "trust"],
    "wordFamily": { "noun": ["cartel"] }
  },
  "w_b4_53": {
    "synonyms": ["contracting out", "subcontracting", "delegation"],
    "wordFamily": { "noun": ["outsourcing"], "verb": ["outsource"] }
  },
  "w_b4_54": {
    "synonyms": ["relocation", "transfer", "outsourcing"],
    "wordFamily": { "noun": ["offshoring"], "verb": ["offshore"] }
  },
  "w_b4_55": {
    "synonyms": ["reduction", "cutback", "layoffs"],
    "wordFamily": { "noun": ["downsizing"], "verb": ["downsize"] }
  },
  "w_b4_56": {
    "synonyms": ["reorganization", "reshuffle", "overhaul"],
    "wordFamily": { "noun": ["restructuring"], "verb": ["restructure"] }
  },
  "w_b4_57": {
    "synonyms": ["reduction", "contraction", "decline"],
    "wordFamily": { "noun": ["deflation"], "verb": ["deflate"], "adj": ["deflationary"] }
  },
  "w_b4_58": {
    "synonyms": ["slump", "recession", "downturn"],
    "wordFamily": { "noun": ["depression"], "verb": ["depress"], "adj": ["depressed", "depressing"], "adv": ["depressingly"] }
  },
  "w_b4_59": {
    "synonyms": ["sluggishness", "inactivity", "lethargy"],
    "wordFamily": { "noun": ["stagnation"], "verb": ["stagnate"], "adj": ["stagnant"] }
  },
  "w_b4_60": {
    "synonyms": ["wealth", "success", "affluence"],
    "wordFamily": { "noun": ["prosperity"], "verb": ["prosper"], "adj": ["prosperous"], "adv": ["prosperously"] }
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
console.log('Enrichment for Band 4 Batch 6 completed successfully.');
