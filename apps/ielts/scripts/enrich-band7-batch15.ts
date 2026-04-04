import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_141": {
    "synonyms": ["region", "zone", "district", "sector"],
    "wordFamily": { "noun": ["area"] }
  },
  "w_b7_142": {
    "synonyms": ["gather", "collect", "congregate", "convene"],
    "wordFamily": { "noun": ["assembly"], "verb": ["assemble"] }
  },
  "w_b7_143": {
    "synonyms": ["help", "aid", "support", "back"],
    "wordFamily": { "noun": ["assistance", "assistant"], "verb": ["assist"] }
  },
  "w_b7_144": {
    "synonyms": ["presume", "suppose", "believe", "guess"],
    "wordFamily": { "noun": ["assumption"], "verb": ["assume"] }
  },
  "w_b7_145": {
    "synonyms": ["occur simultaneously", "clash", "concur"],
    "wordFamily": { "noun": ["coincidence"], "verb": ["coincide"], "adj": ["coincidental"], "adv": ["coincidentally"] }
  },
  "w_b7_146": {
    "synonyms": ["fall down", "cave in", "crumble", "fail"],
    "wordFamily": { "noun": ["collapse"], "verb": ["collapse"], "adj": ["collapsible"] }
  },
  "w_b7_147": {
    "synonyms": ["coworker", "associate", "partner", "teammate"],
    "wordFamily": { "noun": ["colleague"] }
  },
  "w_b7_148": {
    "synonyms": ["gather", "accumulate", "amass", "assemble"],
    "wordFamily": { "noun": ["collection", "collector"], "verb": ["collect"], "adj": ["collective"], "adv": ["collectively"] }
  },
  "w_b7_149": {
    "synonyms": ["mix", "blend", "merge", "unite"],
    "wordFamily": { "noun": ["combination"], "verb": ["combine"] }
  },
  "w_b7_150": {
    "synonyms": ["arrive", "appear", "approach", "reach"],
    "wordFamily": { "noun": ["comer"], "verb": ["come"] }
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
console.log('Enriched w_b7_141 to w_b7_150');
