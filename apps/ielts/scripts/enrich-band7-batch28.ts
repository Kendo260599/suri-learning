import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_271": {
    "synonyms": ["pollution", "infection", "tainting", "impurity"],
    "wordFamily": { "noun": ["contamination", "contaminant"], "verb": ["contaminate"], "adj": ["contaminated"] }
  },
  "w_b7_272": {
    "synonyms": ["consider", "think about", "ponder", "reflect on"],
    "wordFamily": { "noun": ["contemplation"], "verb": ["contemplate"], "adj": ["contemplative"] }
  },
  "w_b7_273": {
    "synonyms": ["modern", "current", "present-day", "peer"],
    "wordFamily": { "noun": ["contemporary"], "adj": ["contemporary"] }
  },
  "w_b7_274": {
    "synonyms": ["argue", "assert", "claim", "compete"],
    "wordFamily": { "noun": ["contention", "contender"], "verb": ["contend"], "adj": ["contentious"] }
  },
  "w_b7_275": {
    "synonyms": ["satisfied", "happy", "pleased", "substance"],
    "wordFamily": { "noun": ["content", "contentment"], "verb": ["content"], "adj": ["content", "contented"] }
  },
  "w_b7_276": {
    "synonyms": ["disagreement", "dispute", "argument", "claim"],
    "wordFamily": { "noun": ["contention"], "verb": ["contend"], "adj": ["contentious"] }
  },
  "w_b7_277": {
    "synonyms": ["competition", "match", "tournament", "challenge"],
    "wordFamily": { "noun": ["contest", "contestant"], "verb": ["contest"] }
  },
  "w_b7_278": {
    "synonyms": ["landmass", "mainland"],
    "wordFamily": { "noun": ["continent"], "adj": ["continental"] }
  },
  "w_b7_279": {
    "synonyms": ["continuous", "constant", "frequent", "repeated"],
    "wordFamily": { "adj": ["continual", "continuous"], "adv": ["continually"] }
  },
  "w_b7_280": {
    "synonyms": ["constantly", "always", "repeatedly", "frequently"],
    "wordFamily": { "adj": ["continual", "continuous"], "adv": ["continually"] }
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
console.log('Enriched w_b7_271 to w_b7_280');
