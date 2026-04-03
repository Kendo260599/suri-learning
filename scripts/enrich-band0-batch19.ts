import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b0_181": {
    "synonyms": ["following", "behind", "subsequently", "later"],
    "wordFamily": { "prep": ["after"], "adv": ["after"], "adj": ["after"] }
  },
  "w_b0_182": {
    "synonyms": ["currently", "presently", "at present", "immediately"],
    "wordFamily": { "adv": ["now"], "noun": ["now"] }
  },
  "w_b0_183": {
    "synonyms": ["next", "afterward", "subsequently", "later"],
    "wordFamily": { "adv": ["then"], "adj": ["then"] }
  },
  "w_b0_184": {
    "synonyms": ["shortly", "presently", "before long", "quickly"],
    "wordFamily": { "adv": ["soon"] }
  },
  "w_b0_185": {
    "synonyms": ["tardy", "delayed", "overdue", "belated"],
    "wordFamily": { "adj": ["late"], "adv": ["late", "lately"], "noun": ["lateness"] }
  },
  "w_b0_186": {
    "synonyms": ["premature", "advance", "forward", "prompt"],
    "wordFamily": { "adj": ["early"], "adv": ["early"], "noun": ["earliness"] }
  },
  "w_b0_187": {
    "synonyms": ["forever", "constantly", "continually", "perpetually"],
    "wordFamily": { "adv": ["always"] }
  },
  "w_b0_188": {
    "synonyms": ["not ever", "at no time", "not at all"],
    "wordFamily": { "adv": ["never"] }
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
console.log('Enriched w_b0_181 to w_b0_188');
