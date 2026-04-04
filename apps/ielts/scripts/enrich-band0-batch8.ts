import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_71": {
    "synonyms": ["cavern", "grotto", "hollow", "den"],
    "wordFamily": { "noun": ["cave", "cavern"], "verb": ["cave"] }
  },
  "w_b0_72": {
    "synonyms": ["coast", "beach", "seaside", "bank"],
    "wordFamily": { "noun": ["shore", "shoreline"] }
  },
  "w_b0_73": {
    "synonyms": ["shore", "seaside", "beach", "coastline"],
    "wordFamily": { "noun": ["coast", "coastline"], "adj": ["coastal"] }
  },
  "w_b0_74": {
    "synonyms": ["ripple", "swell", "breaker", "surge"],
    "wordFamily": { "noun": ["wave"], "verb": ["wave"], "adj": ["wavy"] }
  },
  "w_b0_75": {
    "synonyms": ["current", "flow", "stream", "course"],
    "wordFamily": { "noun": ["tide"], "adj": ["tidal"] }
  },
  "w_b0_76": {
    "synonyms": ["flow", "stream", "tide", "draft"],
    "wordFamily": { "noun": ["current", "currency"], "adj": ["current"], "adv": ["currently"] }
  },
  "w_b0_77": {
    "synonyms": ["skyline", "perspective", "prospect", "boundary"],
    "wordFamily": { "noun": ["horizon"], "adj": ["horizontal"], "adv": ["horizontally"] }
  },
  "w_b0_78": {
    "synonyms": ["peak", "top", "pinnacle", "apex"],
    "wordFamily": { "noun": ["summit"] }
  },
  "w_b0_79": {
    "synonyms": ["summit", "top", "pinnacle", "crest"],
    "wordFamily": { "noun": ["peak"], "verb": ["peak"] }
  },
  "w_b0_80": {
    "synonyms": ["incline", "slant", "gradient", "hill"],
    "wordFamily": { "noun": ["slope"], "verb": ["slope"], "adj": ["sloping"] }
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
console.log('Enriched w_b0_71 to w_b0_80');
