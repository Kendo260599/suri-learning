import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_61": {
    "synonyms": ["heavens", "firmament", "atmosphere"],
    "wordFamily": { "noun": ["sky"] }
  },
  "w_b0_62": {
    "synonyms": ["fog", "mist", "haze", "vapor"],
    "wordFamily": { "noun": ["cloud"], "verb": ["cloud"], "adj": ["cloudy", "cloudless"] }
  },
  "w_b0_63": {
    "synonyms": ["rainfall", "precipitation", "drizzle", "shower"],
    "wordFamily": { "noun": ["rain", "rainbow", "raindrop"], "verb": ["rain"], "adj": ["rainy"] }
  },
  "w_b0_64": {
    "synonyms": ["snowfall", "blizzard", "flake", "precipitation"],
    "wordFamily": { "noun": ["snow", "snowman", "snowflake"], "verb": ["snow"], "adj": ["snowy"] }
  },
  "w_b0_65": {
    "synonyms": ["breeze", "gale", "gust", "draft"],
    "wordFamily": { "noun": ["wind", "windmill"], "verb": ["wind"], "adj": ["windy"] }
  },
  "w_b0_66": {
    "synonyms": ["climate", "conditions", "meteorology"],
    "wordFamily": { "noun": ["weather"], "verb": ["weather"] }
  },
  "w_b0_67": {
    "synonyms": ["world", "globe", "planet", "ground"],
    "wordFamily": { "noun": ["earth", "earthquake"], "adj": ["earthly", "earthen"] }
  },
  "w_b0_68": {
    "synonyms": ["earth", "globe", "planet", "universe"],
    "wordFamily": { "noun": ["world"], "adj": ["worldly", "worldwide"] }
  },
  "w_b0_69": {
    "synonyms": ["room", "area", "gap", "distance"],
    "wordFamily": { "noun": ["space", "spaceship", "spacing"], "verb": ["space"], "adj": ["spacious"] }
  },
  "w_b0_70": {
    "synonyms": ["dale", "glen", "hollow", "ravine"],
    "wordFamily": { "noun": ["valley"] }
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
console.log('Enriched w_b0_61 to w_b0_70');
