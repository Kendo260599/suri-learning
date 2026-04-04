import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_261": {
    "synonyms": ["building", "creation", "structure", "assembly"],
    "wordFamily": { "noun": ["construction"], "verb": ["construct"], "adj": ["constructive"] }
  },
  "w_b7_262": {
    "synonyms": ["helpful", "useful", "positive", "productive"],
    "wordFamily": { "noun": ["construction"], "verb": ["construct"], "adj": ["constructive"], "adv": ["constructively"] }
  },
  "w_b7_263": {
    "synonyms": ["ask", "seek advice", "confer", "refer to"],
    "wordFamily": { "noun": ["consultant", "consultation"], "verb": ["consult"] }
  },
  "w_b7_264": {
    "synonyms": ["advisor", "expert", "specialist", "counselor"],
    "wordFamily": { "noun": ["consultant", "consultation"], "verb": ["consult"] }
  },
  "w_b7_265": {
    "synonyms": ["discussion", "meeting", "interview", "conference"],
    "wordFamily": { "noun": ["consultation", "consultant"], "verb": ["consult"] }
  },
  "w_b7_266": {
    "synonyms": ["eat", "drink", "use up", "absorb"],
    "wordFamily": { "noun": ["consumption", "consumer"], "verb": ["consume"] }
  },
  "w_b7_267": {
    "synonyms": ["touch", "connection", "communication", "reach"],
    "wordFamily": { "noun": ["contact"], "verb": ["contact"] }
  },
  "w_b7_268": {
    "synonyms": ["hold", "include", "comprise", "control"],
    "wordFamily": { "noun": ["container"], "verb": ["contain"] }
  },
  "w_b7_269": {
    "synonyms": ["receptacle", "vessel", "box", "canister"],
    "wordFamily": { "noun": ["container"], "verb": ["contain"] }
  },
  "w_b7_270": {
    "synonyms": ["pollute", "infect", "taint", "spoil"],
    "wordFamily": { "noun": ["contamination", "contaminant"], "verb": ["contaminate"], "adj": ["contaminated"] }
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
console.log('Enriched w_b7_261 to w_b7_270');
