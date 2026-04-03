import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_131": {
    "synonyms": ["work", "toil", "effort", "exertion"],
    "wordFamily": { "noun": ["labour", "labourer"], "verb": ["labour"], "adj": ["laborious"] }
  },
  "w_b6_132": {
    "synonyms": ["stratum", "tier", "level", "sheet"],
    "wordFamily": { "noun": ["layer"], "verb": ["layer"], "adj": ["layered"] }
  },
  "w_b6_133": {
    "synonyms": ["talk", "presentation", "address", "sermon"],
    "wordFamily": { "noun": ["lecture", "lecturer"], "verb": ["lecture"] }
  },
  "w_b6_134": {
    "synonyms": ["lawful", "legitimate", "statutory", "judicial"],
    "wordFamily": { "noun": ["legality", "legalization"], "verb": ["legalize"], "adj": ["legal"], "adv": ["legally"] }
  },
  "w_b6_135": {
    "synonyms": ["reason", "motivation", "incentive", "cause"],
    "wordFamily": { "noun": ["motive", "motivation"], "verb": ["motivate"], "adj": ["motivational"] }
  },
  "w_b6_136": {
    "synonyms": ["reciprocal", "common", "shared", "joint"],
    "wordFamily": { "noun": ["mutuality"], "adj": ["mutual"], "adv": ["mutually"] }
  },
  "w_b6_137": {
    "synonyms": ["nullify", "invalidate", "cancel", "void"],
    "wordFamily": { "noun": ["negation"], "verb": ["negate"], "adj": ["negative"] }
  },
  "w_b6_138": {
    "synonyms": ["nonetheless", "even so", "still", "however"],
    "wordFamily": { "adv": ["nevertheless"] }
  },
  "w_b6_139": {
    "synonyms": ["despite", "in spite of", "regardless of"],
    "wordFamily": { "prep": ["notwithstanding"], "adv": ["notwithstanding"] }
  },
  "w_b6_140": {
    "synonyms": ["usual", "standard", "ordinary", "typical"],
    "wordFamily": { "noun": ["norm", "normality", "normalization"], "verb": ["normalize"], "adj": ["normal"], "adv": ["normally"] }
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
console.log('Enriched w_b6_131 to w_b6_140');
