import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData = {
  "w_b2_161": {
    "synonyms": ["vapor", "fume", "fuel"],
    "wordFamily": { "noun": ["gas", "gasoline"], "verb": ["gas"], "adj": ["gaseous"] }
  },
  "w_b2_162": {
    "synonyms": ["substance", "matter", "fabric"],
    "wordFamily": { "noun": ["material", "materialism"], "verb": ["materialize"], "adj": ["material"], "adv": ["materially"] }
  },
  "w_b2_163": {
    "synonyms": ["standard", "grade", "excellence"],
    "wordFamily": { "noun": ["quality", "qualifications"], "verb": ["qualify"], "adj": ["qualitative"], "adv": ["qualitatively"] }
  },
  "w_b2_164": {
    "synonyms": ["amount", "volume", "measure"],
    "wordFamily": { "noun": ["quantity", "quantification"], "verb": ["quantify"], "adj": ["quantitative"], "adv": ["quantitatively"] }
  },
  "w_b2_165": {
    "synonyms": ["quantity", "volume", "sum"],
    "wordFamily": { "noun": ["amount"], "verb": ["amount"] }
  },
  "w_b2_166": {
    "synonyms": ["figure", "digit", "numeral"],
    "wordFamily": { "noun": ["number", "numeracy"], "verb": ["number", "outnumber"], "adj": ["numerous", "numerical"], "adv": ["numerically"] }
  },
  "w_b2_167": {
    "synonyms": ["calculate", "evaluate", "assess"],
    "wordFamily": { "noun": ["measure", "measurement"], "verb": ["measure"], "adj": ["measurable"], "adv": ["measurably"] }
  },
  "w_b2_168": {
    "synonyms": ["calculation", "evaluation", "assessment"],
    "wordFamily": { "noun": ["measurement", "measure"], "verb": ["measure"], "adj": ["measurable"] }
  },
  "w_b2_169": {
    "synonyms": ["dimensions", "proportions", "magnitude"],
    "wordFamily": { "noun": ["size"], "verb": ["size"], "adj": ["sizable"] }
  },
  "w_b2_170": {
    "synonyms": ["form", "figure", "outline"],
    "wordFamily": { "noun": ["shape"], "verb": ["shape"], "adj": ["shapely", "shapeless"] }
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
console.log('Enrichment for Band 2 Batch 17 completed successfully.');
