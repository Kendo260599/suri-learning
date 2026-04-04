import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_41": {
    "synonyms": ["personal", "biased", "individual"],
    "wordFamily": { "noun": ["subjectivity"], "adj": ["subjective"], "adv": ["subjectively"] }
  },
  "w_b6_42": {
    "synonyms": ["comparative", "proportional", "respective"],
    "wordFamily": { "noun": ["relativity", "relation", "relationship"], "verb": ["relate"], "adj": ["relative", "related"], "adv": ["relatively"] }
  },
  "w_b6_43": {
    "synonyms": ["complete", "total", "unconditional", "utter"],
    "wordFamily": { "noun": ["absolutism"], "adj": ["absolute"], "adv": ["absolutely"] }
  },
  "w_b6_44": {
    "synonyms": ["general", "common", "worldwide", "global"],
    "wordFamily": { "noun": ["universe", "universality"], "adj": ["universal"], "adv": ["universally"] }
  },
  "w_b6_45": {
    "synonyms": ["specific", "certain", "distinct", "precise"],
    "wordFamily": { "noun": ["particularity"], "adj": ["particular"], "adv": ["particularly"] }
  },
  "w_b6_46": {
    "synonyms": ["common", "widespread", "broad", "public"],
    "wordFamily": { "noun": ["generalization", "generality"], "verb": ["generalize"], "adj": ["general"], "adv": ["generally"] }
  },
  "w_b6_47": {
    "synonyms": ["precise", "exact", "particular", "definite"],
    "wordFamily": { "noun": ["specification", "specificity"], "verb": ["specify"], "adj": ["specific"], "adv": ["specifically"] }
  },
  "w_b6_48": {
    "synonyms": ["explanation", "understanding", "analysis", "reading"],
    "wordFamily": { "noun": ["interpretation", "interpreter"], "verb": ["interpret"], "adj": ["interpretative", "interpretive"] }
  },
  "w_b6_49": {
    "synonyms": ["supposition", "presumption", "belief", "premise"],
    "wordFamily": { "noun": ["assumption"], "verb": ["assume"], "adj": ["assumed"] }
  },
  "w_b6_50": {
    "synonyms": ["hypothesis", "principle", "concept", "idea"],
    "wordFamily": { "noun": ["theory", "theorist"], "verb": ["theorize"], "adj": ["theoretical"], "adv": ["theoretically"] }
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
console.log('Enriched w_b6_41 to w_b6_50');
