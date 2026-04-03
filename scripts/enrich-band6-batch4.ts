import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_31": {
    "synonyms": ["innate", "intrinsic", "essential", "built-in"],
    "wordFamily": { "adj": ["inherent"], "adv": ["inherently"] }
  },
  "w_b6_32": {
    "synonyms": ["inherent", "innate", "essential", "natural"],
    "wordFamily": { "adj": ["intrinsic"], "adv": ["intrinsically"] }
  },
  "w_b6_33": {
    "synonyms": ["external", "outside", "foreign"],
    "wordFamily": { "adj": ["extrinsic"], "adv": ["extrinsically"] }
  },
  "w_b6_34": {
    "synonyms": ["clear", "direct", "plain", "obvious"],
    "wordFamily": { "noun": ["explicitness"], "adj": ["explicit"], "adv": ["explicitly"] }
  },
  "w_b6_35": {
    "synonyms": ["implied", "indirect", "unspoken"],
    "wordFamily": { "adj": ["implicit"], "adv": ["implicitly"] }
  },
  "w_b6_36": {
    "synonyms": ["personal", "biased", "individual"],
    "wordFamily": { "noun": ["subjectivity"], "adj": ["subjective"], "adv": ["subjectively"] }
  },
  "w_b6_37": {
    "synonyms": ["impartial", "unbiased", "neutral", "fair"],
    "wordFamily": { "noun": ["objectivity"], "adj": ["objective"], "adv": ["objectively"] }
  },
  "w_b6_38": {
    "synonyms": ["prejudice", "partiality", "favoritism"],
    "wordFamily": { "noun": ["bias"], "verb": ["bias"], "adj": ["biased"] }
  },
  "w_b6_39": {
    "synonyms": ["theoretical", "conceptual", "intangible"],
    "wordFamily": { "noun": ["abstract", "abstraction"], "verb": ["abstract"], "adj": ["abstracted"], "adv": ["abstractly"] }
  },
  "w_b6_40": {
    "synonyms": ["solid", "tangible", "real", "specific"],
    "wordFamily": { "noun": ["concreteness"], "adj": ["concrete"], "adv": ["concretely"] }
  }
};

for (const [id, data] of Object.entries(enrichments)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
  const replacement = `$1,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
  
  if (content.includes(`"id": "${id}"`) && !content.includes(`"id": "${id}"` + '[\s\S]*?"synonyms":')) {
      content = content.replace(regex, replacement);
  }
}

fs.writeFileSync(vocabPath, content);
console.log('Enriched w_b6_31 to w_b6_40');
