import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_81": {
    "synonyms": ["crest", "edge", "spine", "hill"],
    "wordFamily": { "noun": ["ridge"] }
  },
  "w_b0_82": {
    "synonyms": ["iceberg", "ice field", "ice mass"],
    "wordFamily": { "noun": ["glacier"], "adj": ["glacial"] }
  },
  "w_b0_83": {
    "synonyms": ["gorge", "ravine", "chasm", "valley"],
    "wordFamily": { "noun": ["canyon"] }
  },
  "w_b0_84": {
    "synonyms": ["haven", "refuge", "sanctuary", "retreat"],
    "wordFamily": { "noun": ["oasis"] }
  },
  "w_b0_85": {
    "synonyms": ["sand hill", "mound", "hillock", "bank"],
    "wordFamily": { "noun": ["dune"] }
  },
  "w_b0_86": {
    "synonyms": ["polyp", "reef", "pinkish-red"],
    "wordFamily": { "noun": ["coral"] }
  },
  "w_b0_87": {
    "synonyms": ["shoal", "sandbar", "ridge", "bank"],
    "wordFamily": { "noun": ["reef"] }
  },
  "w_b0_88": {
    "synonyms": ["cave", "grotto", "hollow", "den"],
    "wordFamily": { "noun": ["cavern", "cave"], "adj": ["cavernous"] }
  },
  "w_b0_89": {
    "synonyms": ["cave", "cavern", "hollow", "den"],
    "wordFamily": { "noun": ["grotto"] }
  },
  "w_b0_90": {
    "synonyms": ["precipice", "bluff", "crag", "escarpment"],
    "wordFamily": { "noun": ["cliff"] }
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
console.log('Enriched w_b0_81 to w_b0_90');
