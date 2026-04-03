import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_91": {
    "synonyms": ["ban", "boycott", "restriction", "prohibition"],
    "wordFamily": { "noun": ["embargo"], "verb": ["embargo"] }
  },
  "w_b6_92": {
    "synonyms": ["procedure", "convention", "etiquette", "code"],
    "wordFamily": { "noun": ["protocol"] }
  },
  "w_b6_93": {
    "synonyms": ["authority", "control", "power", "rule"],
    "wordFamily": { "noun": ["jurisdiction"], "adj": ["jurisdictional"] }
  },
  "w_b6_94": {
    "synonyms": ["conformity", "obedience", "adherence", "observance"],
    "wordFamily": { "noun": ["compliance"], "verb": ["comply"], "adj": ["compliant"] }
  },
  "w_b6_95": {
    "synonyms": ["application", "execution", "implementation"],
    "wordFamily": { "noun": ["enforcement", "enforcer"], "verb": ["enforce"], "adj": ["enforceable"] }
  },
  "w_b6_96": {
    "synonyms": ["lawsuit", "legal action", "case", "dispute"],
    "wordFamily": { "noun": ["litigation", "litigant"], "verb": ["litigate"], "adj": ["litigious"] }
  },
  "w_b6_97": {
    "synonyms": ["adjudication", "mediation", "settlement", "judgment"],
    "wordFamily": { "noun": ["arbitration", "arbitrator"], "verb": ["arbitrate"], "adj": ["arbitrary"] }
  },
  "w_b6_98": {
    "synonyms": ["arbitration", "conciliation", "negotiation"],
    "wordFamily": { "noun": ["mediation", "mediator"], "verb": ["mediate"] }
  },
  "w_b6_99": {
    "synonyms": ["agreement", "resolution", "colony", "community"],
    "wordFamily": { "noun": ["settlement", "settler"], "verb": ["settle"], "adj": ["settled"] }
  },
  "w_b6_100": {
    "synonyms": ["diverge", "stray", "digress", "veer"],
    "wordFamily": { "noun": ["deviation"], "verb": ["deviate"], "adj": ["deviant"] }
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
console.log('Enriched w_b6_91 to w_b6_100');
