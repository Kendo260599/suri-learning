import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_71": {
    "synonyms": ["belief", "religion", "faith", "spirituality"],
    "wordFamily": { "noun": ["theism", "theist"], "adj": ["theistic"] }
  },
  "w_b7_72": {
    "synonyms": ["nature worship", "animism"],
    "wordFamily": { "noun": ["pantheism", "pantheist"], "adj": ["pantheistic"] }
  },
  "w_b7_73": {
    "synonyms": ["freethinking", "rationalism"],
    "wordFamily": { "noun": ["deism", "deist"], "adj": ["deistic"] }
  },
  "w_b7_74": {
    "synonyms": ["belief in one god"],
    "wordFamily": { "noun": ["monotheism", "monotheist"], "adj": ["monotheistic"] }
  },
  "w_b7_75": {
    "synonyms": ["paganism", "heathenism"],
    "wordFamily": { "noun": ["polytheism", "polytheist"], "adj": ["polytheistic"] }
  },
  "w_b7_76": {
    "synonyms": ["spiritualism", "occultism", "transcendentalism"],
    "wordFamily": { "noun": ["mysticism", "mystic"], "adj": ["mystical"], "adv": ["mystically"] }
  },
  "w_b7_77": {
    "synonyms": ["impose", "apply", "implement", "administer"],
    "wordFamily": { "noun": ["enforcement", "enforcer"], "verb": ["enforce"], "adj": ["enforceable"] }
  },
  "w_b7_78": {
    "synonyms": ["improve", "increase", "boost", "strengthen"],
    "wordFamily": { "noun": ["enhancement", "enhancer"], "verb": ["enhance"], "adj": ["enhanced"] }
  },
  "w_b7_79": {
    "synonyms": ["huge", "massive", "gigantic", "immense"],
    "wordFamily": { "noun": ["enormity"], "adj": ["enormous"], "adv": ["enormously"] }
  },
  "w_b7_80": {
    "synonyms": ["organization", "institution", "body", "establishment"],
    "wordFamily": { "noun": ["entity"] }
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
console.log('Enriched w_b7_71 to w_b7_80');
