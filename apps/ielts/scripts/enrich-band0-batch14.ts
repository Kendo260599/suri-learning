import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_131": {
    "synonyms": ["ballpoint", "quill", "marker", "stylus"],
    "wordFamily": { "noun": ["pen"], "verb": ["pen"] }
  },
  "w_b0_132": {
    "synonyms": ["mug", "teacup", "goblet", "chalice"],
    "wordFamily": { "noun": ["cup"], "verb": ["cup"] }
  },
  "w_b0_133": {
    "synonyms": ["dish", "platter", "saucer", "tray"],
    "wordFamily": { "noun": ["plate"], "verb": ["plate"] }
  },
  "w_b0_134": {
    "synonyms": ["branch", "split", "divide", "prong"],
    "wordFamily": { "noun": ["fork"], "verb": ["fork"] }
  },
  "w_b0_135": {
    "synonyms": ["ladle", "scoop", "stirrer"],
    "wordFamily": { "noun": ["spoon", "spoonful"], "verb": ["spoon"] }
  },
  "w_b0_136": {
    "synonyms": ["blade", "dagger", "cutter", "scalpel"],
    "wordFamily": { "noun": ["knife"], "verb": ["knife"] }
  },
  "w_b0_137": {
    "synonyms": ["tumbler", "goblet", "mirror", "lens"],
    "wordFamily": { "noun": ["glass", "glasses"], "adj": ["glassy"] }
  },
  "w_b0_138": {
    "synonyms": ["dish", "basin", "vessel", "pot"],
    "wordFamily": { "noun": ["bowl"], "verb": ["bowl"] }
  },
  "w_b0_139": {
    "synonyms": ["chef", "prepare", "make", "bake"],
    "wordFamily": { "noun": ["cook", "cooker", "cooking"], "verb": ["cook"] }
  },
  "w_b0_140": {
    "synonyms": ["angle", "bend", "turn", "nook"],
    "wordFamily": { "noun": ["corner"], "verb": ["corner"] }
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
console.log('Enriched w_b0_131 to w_b0_140');
