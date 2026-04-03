import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_91": {
    "synonyms": ["world", "earth", "sphere", "planet"],
    "wordFamily": { "noun": ["globe"], "adj": ["global"], "adv": ["globally"] }
  },
  "w_b7_92": {
    "synonyms": ["level", "rank", "mark", "score"],
    "wordFamily": { "noun": ["grade", "grading"], "verb": ["grade"] }
  },
  "w_b7_93": {
    "synonyms": ["award", "allowance", "subsidy", "donation"],
    "wordFamily": { "noun": ["grant"], "verb": ["grant"] }
  },
  "w_b7_94": {
    "synonyms": ["hinder", "prevent", "restrict", "impede"],
    "wordFamily": { "noun": ["inhibition"], "verb": ["inhibit"], "adj": ["inhibited"] }
  },
  "w_b7_95": {
    "synonyms": ["first", "beginning", "opening", "introductory"],
    "wordFamily": { "noun": ["initial", "initials"], "verb": ["initial"], "adj": ["initial"], "adv": ["initially"] }
  },
  "w_b7_96": {
    "synonyms": ["start", "begin", "commence", "launch"],
    "wordFamily": { "noun": ["initiation", "initiator", "initiative"], "verb": ["initiate"] }
  },
  "w_b7_97": {
    "synonyms": ["hurt", "harm", "wound", "damage"],
    "wordFamily": { "noun": ["injury"], "verb": ["injure"], "adj": ["injured"] }
  },
  "w_b7_98": {
    "synonyms": ["invent", "pioneer", "introduce", "revolutionize"],
    "wordFamily": { "noun": ["innovation", "innovator"], "verb": ["innovate"], "adj": ["innovative"] }
  },
  "w_b7_99": {
    "synonyms": ["contribution", "data", "information", "feedback"],
    "wordFamily": { "noun": ["input"], "verb": ["input"] }
  },
  "w_b7_100": {
    "synonyms": ["put in", "add", "enter", "include"],
    "wordFamily": { "noun": ["insertion", "insert"], "verb": ["insert"] }
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
console.log('Enriched w_b7_91 to w_b7_100');
