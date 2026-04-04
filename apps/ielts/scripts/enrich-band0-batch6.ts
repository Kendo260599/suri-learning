import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_51": {
    "synonyms": ["peak", "mount", "hill", "alp"],
    "wordFamily": { "noun": ["mountain", "mountaineer", "mountaineering"], "adj": ["mountainous"] }
  },
  "w_b0_52": {
    "synonyms": ["stream", "creek", "brook", "waterway"],
    "wordFamily": { "noun": ["river"] }
  },
  "w_b0_53": {
    "synonyms": ["pond", "pool", "reservoir", "loch"],
    "wordFamily": { "noun": ["lake"] }
  },
  "w_b0_54": {
    "synonyms": ["sea", "deep", "main", "water"],
    "wordFamily": { "noun": ["ocean"], "adj": ["oceanic"] }
  },
  "w_b0_55": {
    "synonyms": ["woods", "woodland", "jungle", "timberland"],
    "wordFamily": { "noun": ["forest", "forestry", "forester"], "verb": ["afforest", "deforest"] }
  },
  "w_b0_56": {
    "synonyms": ["wasteland", "wilderness", "barren", "sand"],
    "wordFamily": { "noun": ["desert", "desertion"], "verb": ["desert"], "adj": ["deserted"] }
  },
  "w_b0_57": {
    "synonyms": ["isle", "islet", "atoll", "cay"],
    "wordFamily": { "noun": ["island", "islander"] }
  },
  "w_b0_58": {
    "synonyms": ["garden", "green", "recreation ground", "reserve"],
    "wordFamily": { "noun": ["park", "parking"], "verb": ["park"] }
  },
  "w_b0_59": {
    "synonyms": ["coast", "shore", "seaside", "sand"],
    "wordFamily": { "noun": ["beach"] }
  },
  "w_b0_60": {
    "synonyms": ["sun", "celebrity", "idol", "luminary"],
    "wordFamily": { "noun": ["star", "stardom"], "verb": ["star"], "adj": ["starry"] }
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
console.log('Enriched w_b0_51 to w_b0_60');
