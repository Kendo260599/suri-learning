import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_121": {
    "synonyms": ["show", "state", "point out", "designate"],
    "wordFamily": { "noun": ["indication", "indicator"], "verb": ["indicate"], "adj": ["indicative"] }
  },
  "w_b6_122": {
    "synonyms": ["single", "separate", "distinct", "particular"],
    "wordFamily": { "noun": ["individual", "individuality", "individualism"], "adj": ["individual", "individualistic"], "adv": ["individually"] }
  },
  "w_b6_123": {
    "synonyms": ["persuade", "convince", "cause", "bring about"],
    "wordFamily": { "noun": ["inducement"], "verb": ["induce"] }
  },
  "w_b6_124": {
    "synonyms": ["deduce", "conclude", "surmise", "reason"],
    "wordFamily": { "noun": ["inference"], "verb": ["infer"], "adj": ["inferential"] }
  },
  "w_b6_125": {
    "synonyms": ["matter", "problem", "topic", "edition"],
    "wordFamily": { "noun": ["issue"], "verb": ["issue"] }
  },
  "w_b6_126": {
    "synonyms": ["object", "article", "thing", "piece"],
    "wordFamily": { "noun": ["item", "itemization"], "verb": ["itemize"] }
  },
  "w_b6_127": {
    "synonyms": ["work", "employment", "occupation", "task"],
    "wordFamily": { "noun": ["job", "jobless"] }
  },
  "w_b6_128": {
    "synonyms": ["diary", "log", "periodical", "magazine"],
    "wordFamily": { "noun": ["journal", "journalism", "journalist"], "adj": ["journalistic"] }
  },
  "w_b6_129": {
    "synonyms": ["explain", "rationalize", "defend", "warrant"],
    "wordFamily": { "noun": ["justification"], "verb": ["justify"], "adj": ["justifiable", "justified"], "adv": ["justifiably"] }
  },
  "w_b6_130": {
    "synonyms": ["tag", "sticker", "marker", "description"],
    "wordFamily": { "noun": ["label"], "verb": ["label"] }
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
console.log('Enriched w_b6_121 to w_b6_130');
