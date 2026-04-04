import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_101": {
    "synonyms": ["understanding", "awareness", "perception", "intuition"],
    "wordFamily": { "noun": ["insight"], "adj": ["insightful"], "adv": ["insightfully"] }
  },
  "w_b7_102": {
    "synonyms": ["examine", "check", "scrutinize", "investigate"],
    "wordFamily": { "noun": ["inspection", "inspector"], "verb": ["inspect"] }
  },
  "w_b7_103": {
    "synonyms": ["make laws", "enact", "pass", "decree"],
    "wordFamily": { "noun": ["legislation", "legislator", "legislature"], "verb": ["legislate"], "adj": ["legislative"] }
  },
  "w_b7_104": {
    "synonyms": ["tax", "charge", "fee", "toll"],
    "wordFamily": { "noun": ["levy"], "verb": ["levy"] }
  },
  "w_b7_105": {
    "synonyms": ["progressive", "broad-minded", "tolerant", "generous"],
    "wordFamily": { "noun": ["liberal", "liberalism"], "adj": ["liberal"], "adv": ["liberally"] }
  },
  "w_b7_106": {
    "synonyms": ["permit", "certificate", "authorization", "warrant"],
    "wordFamily": { "noun": ["licence", "licensee"], "verb": ["license"] }
  },
  "w_b7_107": {
    "synonyms": ["similarly", "also", "too", "equally"],
    "wordFamily": { "adv": ["likewise"] }
  },
  "w_b7_108": {
    "synonyms": ["connection", "relationship", "tie", "bond"],
    "wordFamily": { "noun": ["link", "linkage"], "verb": ["link"] }
  },
  "w_b7_109": {
    "synonyms": ["find", "discover", "position", "situate"],
    "wordFamily": { "noun": ["location"], "verb": ["locate"] }
  },
  "w_b7_110": {
    "synonyms": ["keep", "preserve", "continue", "sustain"],
    "wordFamily": { "noun": ["maintenance"], "verb": ["maintain"] }
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
console.log('Enriched w_b7_101 to w_b7_110');
