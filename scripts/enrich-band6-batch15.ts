import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_141": {
    "synonyms": ["idea", "belief", "concept", "view"],
    "wordFamily": { "noun": ["notion"], "adj": ["notional"] }
  },
  "w_b6_142": {
    "synonyms": ["atomic", "central", "core"],
    "wordFamily": { "noun": ["nucleus"], "adj": ["nuclear"] }
  },
  "w_b6_143": {
    "synonyms": ["enterprise", "drive", "ambition", "plan"],
    "wordFamily": { "noun": ["initiative", "initiation"], "verb": ["initiate"], "adj": ["initial", "initiatory"], "adv": ["initially"] }
  },
  "w_b6_144": {
    "synonyms": ["poll", "study", "review", "investigation"],
    "wordFamily": { "noun": ["survey", "surveyor"], "verb": ["survey"] }
  },
  "w_b6_145": {
    "synonyms": ["interrupt", "delay", "postpone", "hang"],
    "wordFamily": { "noun": ["suspension"], "verb": ["suspend"], "adj": ["suspended"] }
  },
  "w_b6_146": {
    "synonyms": ["maintain", "support", "continue", "uphold"],
    "wordFamily": { "noun": ["sustainability", "sustenance"], "verb": ["sustain"], "adj": ["sustainable", "sustained"] }
  },
  "w_b6_147": {
    "synonyms": ["sign", "emblem", "token", "representation"],
    "wordFamily": { "noun": ["symbol", "symbolism"], "verb": ["symbolize"], "adj": ["symbolic"], "adv": ["symbolically"] }
  },
  "w_b6_148": {
    "synonyms": ["goal", "objective", "aim", "mark"],
    "wordFamily": { "noun": ["target"], "verb": ["target"] }
  },
  "w_b6_149": {
    "synonyms": ["specialized", "scientific", "practical", "mechanical"],
    "wordFamily": { "noun": ["technician", "technicality"], "adj": ["technical"], "adv": ["technically"] }
  },
  "w_b6_150": {
    "synonyms": ["method", "approach", "procedure", "skill"],
    "wordFamily": { "noun": ["technique"] }
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
console.log('Enriched w_b6_141 to w_b6_150');
