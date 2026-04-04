import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_171": {
    "synonyms": ["slanting", "oblique", "crossways", "angled"],
    "wordFamily": { "adj": ["diagonal"], "adv": ["diagonally"] }
  },
  "w_b0_172": {
    "synonyms": ["over", "higher", "up", "overhead"],
    "wordFamily": { "adv": ["above"], "prep": ["above"] }
  },
  "w_b0_173": {
    "synonyms": ["under", "beneath", "underneath", "lower"],
    "wordFamily": { "adv": ["below"], "prep": ["below"] }
  },
  "w_b0_174": {
    "synonyms": ["below", "beneath", "underneath", "lower"],
    "wordFamily": { "prep": ["under"], "adv": ["under"] }
  },
  "w_b0_175": {
    "synonyms": ["above", "across", "beyond", "past"],
    "wordFamily": { "prep": ["over"], "adv": ["over"] }
  },
  "w_b0_176": {
    "synonyms": ["amid", "betwixt", "in the middle of"],
    "wordFamily": { "prep": ["between"], "adv": ["between"] }
  },
  "w_b0_177": {
    "synonyms": ["amidst", "in the middle of", "with", "between"],
    "wordFamily": { "prep": ["among"] }
  },
  "w_b0_178": {
    "synonyms": ["next to", "alongside", "by", "near"],
    "wordFamily": { "prep": ["beside"] }
  },
  "w_b0_179": {
    "synonyms": ["at the back of", "after", "following", "rearward"],
    "wordFamily": { "prep": ["behind"], "adv": ["behind"] }
  },
  "w_b0_180": {
    "synonyms": ["prior to", "ahead of", "in front of", "earlier"],
    "wordFamily": { "prep": ["before"], "adv": ["before"] }
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
console.log('Enriched w_b0_171 to w_b0_180');
