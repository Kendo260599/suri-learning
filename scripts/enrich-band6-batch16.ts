import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_151": {
    "synonyms": ["brief", "short-term", "provisional", "transient"],
    "wordFamily": { "adj": ["temporary"], "adv": ["temporarily"] }
  },
  "w_b6_152": {
    "synonyms": ["strained", "tight", "anxious", "nervous"],
    "wordFamily": { "noun": ["tension"], "verb": ["tense"], "adj": ["tense"], "adv": ["tensely"] }
  },
  "w_b6_153": {
    "synonyms": ["end", "finish", "conclude", "stop"],
    "wordFamily": { "noun": ["termination", "terminator"], "verb": ["terminate"], "adj": ["terminal"], "adv": ["terminally"] }
  },
  "w_b6_154": {
    "synonyms": ["content", "writing", "script", "passage"],
    "wordFamily": { "noun": ["text", "textbook"], "adj": ["textual"] }
  },
  "w_b6_155": {
    "synonyms": ["subject", "topic", "motif", "idea"],
    "wordFamily": { "noun": ["theme"], "adj": ["thematic"], "adv": ["thematically"] }
  },
  "w_b6_156": {
    "synonyms": ["adjust", "modify", "alter", "acclimatize"],
    "wordFamily": { "noun": ["adaptation", "adaptability"], "verb": ["adapt"], "adj": ["adaptable", "adaptive"] }
  },
  "w_b6_157": {
    "synonyms": ["neighboring", "adjoining", "bordering", "next door"],
    "wordFamily": { "noun": ["adjacency"], "adj": ["adjacent"] }
  },
  "w_b6_158": {
    "synonyms": ["modify", "alter", "adapt", "regulate"],
    "wordFamily": { "noun": ["adjustment"], "verb": ["adjust"], "adj": ["adjustable"] }
  },
  "w_b6_159": {
    "synonyms": ["manage", "direct", "govern", "supervise"],
    "wordFamily": { "noun": ["administration", "administrator"], "verb": ["administrate", "administer"], "adj": ["administrative"], "adv": ["administratively"] }
  },
  "w_b6_160": {
    "synonyms": ["grown-up", "mature", "full-grown"],
    "wordFamily": { "noun": ["adult", "adulthood"], "adj": ["adult"] }
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
console.log('Enriched w_b6_151 to w_b6_160');
