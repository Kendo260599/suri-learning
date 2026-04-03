import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_101": {
    "synonyms": ["decrease", "reduce", "lessen", "decline"],
    "wordFamily": { "noun": ["diminution"], "verb": ["diminish"], "adj": ["diminished", "diminishing"] }
  },
  "w_b6_102": {
    "synonyms": ["separate", "distinct", "detached", "individual"],
    "wordFamily": { "noun": ["discretion"], "adj": ["discrete"], "adv": ["discretely"] }
  },
  "w_b6_103": {
    "synonyms": ["replace", "supplant", "uproot", "dislodge"],
    "wordFamily": { "noun": ["displacement"], "verb": ["displace"], "adj": ["displaced"] }
  },
  "w_b6_104": {
    "synonyms": ["misrepresent", "twist", "warp", "contort"],
    "wordFamily": { "noun": ["distortion"], "verb": ["distort"], "adj": ["distorted"] }
  },
  "w_b6_105": {
    "synonyms": ["realm", "field", "area", "sphere"],
    "wordFamily": { "noun": ["domain"] }
  },
  "w_b6_106": {
    "synonyms": ["outline", "sketch", "version", "plan"],
    "wordFamily": { "noun": ["draft", "drafter"], "verb": ["draft"] }
  },
  "w_b6_107": {
    "synonyms": ["period", "length", "time", "span"],
    "wordFamily": { "noun": ["duration"], "adj": ["durable"] }
  },
  "w_b6_108": {
    "synonyms": ["energetic", "active", "vibrant", "changing"],
    "wordFamily": { "noun": ["dynamism", "dynamics"], "adj": ["dynamic"], "adv": ["dynamically"] }
  },
  "w_b6_109": {
    "synonyms": ["remove", "get rid of", "exclude", "discard"],
    "wordFamily": { "noun": ["elimination"], "verb": ["eliminate"] }
  },
  "w_b6_110": {
    "synonyms": ["limited", "restricted", "fixed", "bounded"],
    "wordFamily": { "noun": ["infinity"], "adj": ["finite", "infinite"], "adv": ["finitely"] }
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
console.log('Enriched w_b6_101 to w_b6_110');
