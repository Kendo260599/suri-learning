import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_61": {
    "synonyms": ["inheritance", "legacy", "tradition", "ancestry"],
    "wordFamily": { "noun": ["heritage", "inheritance"], "verb": ["inherit"], "adj": ["hereditary"] }
  },
  "w_b6_62": {
    "synonyms": ["custom", "practice", "convention", "ritual"],
    "wordFamily": { "noun": ["tradition", "traditionalism"], "adj": ["traditional"], "adv": ["traditionally"] }
  },
  "w_b6_63": {
    "synonyms": ["subject", "national", "resident", "inhabitant"],
    "wordFamily": { "noun": ["citizen", "citizenship"] }
  },
  "w_b6_64": {
    "synonyms": ["strategy", "plan", "program", "guideline"],
    "wordFamily": { "noun": ["policy", "policymaker"] }
  },
  "w_b6_65": {
    "synonyms": ["regulation", "statute", "act", "decree"],
    "wordFamily": { "noun": ["law", "lawyer", "lawsuit"], "adj": ["lawful", "legal"], "adv": ["lawfully", "legally"] }
  },
  "w_b6_66": {
    "synonyms": ["entitlement", "privilege", "prerogative", "due"],
    "wordFamily": { "noun": ["right"], "adj": ["rightful"], "adv": ["rightfully"] }
  },
  "w_b6_67": {
    "synonyms": ["well-being", "prosperity", "benefit", "assistance"],
    "wordFamily": { "noun": ["welfare"] }
  },
  "w_b6_68": {
    "synonyms": ["autocracy", "tyranny", "totalitarianism", "despotism"],
    "wordFamily": { "noun": ["dictatorship", "dictator"], "adj": ["dictatorial"] }
  },
  "w_b6_69": {
    "synonyms": ["kingship", "sovereignty", "royalty"],
    "wordFamily": { "noun": ["monarchy", "monarch"], "adj": ["monarchical"] }
  },
  "w_b6_70": {
    "synonyms": ["democracy", "commonwealth", "self-government"],
    "wordFamily": { "noun": ["republic", "republicanism"], "adj": ["republican"] }
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
console.log('Enriched w_b6_61 to w_b6_70');
