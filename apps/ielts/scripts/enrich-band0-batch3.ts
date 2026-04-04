import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_21": {
    "synonyms": ["hound", "canine", "pup", "puppy"],
    "wordFamily": { "noun": ["dog", "doggy"], "adj": ["dogged"], "adv": ["doggedly"] }
  },
  "w_b0_22": {
    "synonyms": ["fowl", "chick", "fledgling"],
    "wordFamily": { "noun": ["bird", "birdie"] }
  },
  "w_b0_23": {
    "synonyms": ["seafood"],
    "wordFamily": { "noun": ["fish", "fishing", "fisherman"], "verb": ["fish"], "adj": ["fishy"] }
  },
  "w_b0_24": {
    "synonyms": ["crimson", "scarlet", "ruby"],
    "wordFamily": { "noun": ["red", "redness"], "adj": ["red", "reddish"], "verb": ["redden"] }
  },
  "w_b0_25": {
    "synonyms": ["azure", "cobalt", "sapphire", "navy"],
    "wordFamily": { "noun": ["blue", "blueness"], "adj": ["blue", "bluish"] }
  },
  "w_b0_26": {
    "synonyms": ["emerald", "jade", "olive"],
    "wordFamily": { "noun": ["green", "greenery"], "adj": ["green"] }
  },
  "w_b0_27": {
    "synonyms": ["golden", "blonde", "lemon"],
    "wordFamily": { "noun": ["yellow"], "adj": ["yellow", "yellowish"] }
  },
  "w_b0_28": {
    "synonyms": ["flesh", "food", "muscle"],
    "wordFamily": { "noun": ["meat"], "adj": ["meaty"] }
  },
  "w_b0_29": {
    "synonyms": ["produce", "crop", "harvest", "yield"],
    "wordFamily": { "noun": ["fruit"], "verb": ["fruit"], "adj": ["fruitful", "fruity"] }
  },
  "w_b0_30": {
    "synonyms": ["greens", "produce", "plant"],
    "wordFamily": { "noun": ["vegetable", "vegetarian"], "adj": ["vegetarian"] }
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
console.log('Enriched w_b0_21 to w_b0_30');
