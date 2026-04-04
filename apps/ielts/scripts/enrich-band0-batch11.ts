import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_101": {
    "synonyms": ["cascade", "cataract", "falls", "chute"],
    "wordFamily": { "noun": ["waterfall"] }
  },
  "w_b0_102": {
    "synonyms": ["waterfall", "cataract", "falls", "shower"],
    "wordFamily": { "noun": ["cascade"], "verb": ["cascade"] }
  },
  "w_b0_103": {
    "synonyms": ["white water", "fast water", "current"],
    "wordFamily": { "noun": ["rapids", "rapidity"], "adj": ["rapid"], "adv": ["rapidly"] }
  },
  "w_b0_104": {
    "synonyms": ["mound", "knoll", "hillock", "elevation"],
    "wordFamily": { "noun": ["hill", "hillside", "hilltop"], "adj": ["hilly"] }
  },
  "w_b0_105": {
    "synonyms": ["marsh", "bog", "mire", "morass"],
    "wordFamily": { "noun": ["swamp"], "verb": ["swamp"], "adj": ["swampy"] }
  },
  "w_b0_106": {
    "synonyms": ["swamp", "bog", "mire", "wetland"],
    "wordFamily": { "noun": ["marsh"], "adj": ["marshy"] }
  },
  "w_b0_107": {
    "synonyms": ["pool", "lake", "pond", "inlet"],
    "wordFamily": { "noun": ["lagoon"] }
  },
  "w_b0_108": {
    "synonyms": ["cape", "headland", "point", "promontory"],
    "wordFamily": { "noun": ["peninsula"], "adj": ["peninsular"] }
  },
  "w_b0_109": {
    "synonyms": ["island group", "islands", "chain"],
    "wordFamily": { "noun": ["archipelago"] }
  },
  "w_b0_110": {
    "synonyms": ["headland", "point", "promontory", "peninsula"],
    "wordFamily": { "noun": ["cape"] }
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
console.log('Enriched w_b0_101 to w_b0_110');
