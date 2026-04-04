import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_91": {
    "synonyms": ["cliff", "crag", "bluff", "escarpment"],
    "wordFamily": { "noun": ["precipice"], "adj": ["precipitous"] }
  },
  "w_b0_92": {
    "synonyms": ["tableland", "plain", "mesa", "highland"],
    "wordFamily": { "noun": ["plateau"] }
  },
  "w_b0_93": {
    "synonyms": ["flatland", "prairie", "grassland", "steppe"],
    "wordFamily": { "noun": ["plain", "plainness"], "adj": ["plain"], "adv": ["plainly"] }
  },
  "w_b0_94": {
    "synonyms": ["field", "pasture", "grassland", "paddock"],
    "wordFamily": { "noun": ["meadow"] }
  },
  "w_b0_95": {
    "synonyms": ["field", "meadow", "grassland", "grazing"],
    "wordFamily": { "noun": ["pasture"], "verb": ["pasture"] }
  },
  "w_b0_96": {
    "synonyms": ["pool", "lake", "tarn", "reservoir"],
    "wordFamily": { "noun": ["pond"] }
  },
  "w_b0_97": {
    "synonyms": ["river", "brook", "creek", "flow"],
    "wordFamily": { "noun": ["stream"], "verb": ["stream"] }
  },
  "w_b0_98": {
    "synonyms": ["stream", "creek", "rivulet", "rill"],
    "wordFamily": { "noun": ["brook"] }
  },
  "w_b0_99": {
    "synonyms": ["stream", "brook", "rivulet", "inlet"],
    "wordFamily": { "noun": ["creek"] }
  },
  "w_b0_100": {
    "synonyms": ["waterway", "channel", "strait", "ditch"],
    "wordFamily": { "noun": ["canal"] }
  }
};

for (const [id, data] of Object.entries(enrichments)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
  const replacement = `$1,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
  
  if (content.includes(`"id": "${id}"`) && !content.includes(`"id": "${id}"` + '[\\s\\S]*?"synonyms":')) {
      content = content.replace(regex, replacement);
  }
}

fs.writeFileSync(vocabPath, content);
console.log('Enriched w_b0_91 to w_b0_100');
