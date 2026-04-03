import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_321": {
    "synonyms": ["explain", "describe", "specify", "determine"],
    "wordFamily": { "noun": ["definition"], "verb": ["define"], "adj": ["definable", "defined"] }
  },
  "w_b7_322": {
    "synonyms": ["certain", "clear", "specific", "exact"],
    "wordFamily": { "adj": ["definite"], "adv": ["definitely"] }
  },
  "w_b7_323": {
    "synonyms": ["show", "prove", "display", "exhibit"],
    "wordFamily": { "noun": ["demonstration", "demonstrator"], "verb": ["demonstrate"], "adj": ["demonstrable", "demonstrative"] }
  },
  "w_b7_324": {
    "synonyms": ["indicate", "mean", "signify", "represent"],
    "wordFamily": { "noun": ["denotation"], "verb": ["denote"] }
  },
  "w_b7_325": {
    "synonyms": ["reject", "refuse", "contradict", "dispute"],
    "wordFamily": { "noun": ["denial"], "verb": ["deny"], "adj": ["undeniable"] }
  },
  "w_b7_326": {
    "synonyms": ["sadden", "discourage", "lower", "reduce"],
    "wordFamily": { "noun": ["depression"], "verb": ["depress"], "adj": ["depressed", "depressing"] }
  },
  "w_b7_327": {
    "synonyms": ["obtain", "get", "acquire", "originate"],
    "wordFamily": { "noun": ["derivation", "derivative"], "verb": ["derive"], "adj": ["derivative"] }
  },
  "w_b7_328": {
    "synonyms": ["in spite of", "regardless of", "notwithstanding"],
    "wordFamily": {}
  },
  "w_b7_329": {
    "synonyms": ["discover", "notice", "find", "spot"],
    "wordFamily": { "noun": ["detection", "detective", "detector"], "verb": ["detect"], "adj": ["detectable"] }
  },
  "w_b7_330": {
    "synonyms": ["dedicate", "commit", "give", "allocate"],
    "wordFamily": { "noun": ["devotion", "devotee"], "verb": ["devote"], "adj": ["devoted"] }
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
console.log('Enriched w_b7_321 to w_b7_330');
