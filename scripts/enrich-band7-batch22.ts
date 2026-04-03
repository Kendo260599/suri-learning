import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_211": {
    "synonyms": ["seize", "impound", "take away", "appropriate"],
    "wordFamily": { "noun": ["confiscation"], "verb": ["confiscate"] }
  },
  "w_b7_212": {
    "synonyms": ["dispute", "clash", "disagreement", "friction"],
    "wordFamily": { "noun": ["conflict"], "verb": ["conflict"], "adj": ["conflicting"] }
  },
  "w_b7_213": {
    "synonyms": ["convergence", "meeting", "junction", "joining"],
    "wordFamily": { "noun": ["confluence"] }
  },
  "w_b7_214": {
    "synonyms": ["comply", "obey", "follow", "adapt"],
    "wordFamily": { "noun": ["conformity", "conformist"], "verb": ["conform"] }
  },
  "w_b7_215": {
    "synonyms": ["compliance", "obedience", "agreement", "conventionality"],
    "wordFamily": { "noun": ["conformity", "conformist"], "verb": ["conform"] }
  },
  "w_b7_216": {
    "synonyms": ["baffle", "bewilder", "confuse", "perplex"],
    "wordFamily": { "verb": ["confound"], "adj": ["confounding"] }
  },
  "w_b7_217": {
    "synonyms": ["face", "tackle", "challenge", "meet"],
    "wordFamily": { "noun": ["confrontation"], "verb": ["confront"], "adj": ["confrontational"] }
  },
  "w_b7_218": {
    "synonyms": ["clash", "conflict", "encounter", "fight"],
    "wordFamily": { "noun": ["confrontation"], "verb": ["confront"], "adj": ["confrontational"] }
  },
  "w_b7_219": {
    "synonyms": ["praise", "compliment", "commend", "applaud"],
    "wordFamily": { "noun": ["congratulation"], "verb": ["congratulate"], "adj": ["congratulatory"] }
  },
  "w_b7_220": {
    "synonyms": ["praise", "compliment", "commendation", "felicitation"],
    "wordFamily": { "noun": ["congratulation"], "verb": ["congratulate"], "adj": ["congratulatory"] }
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
console.log('Enriched w_b7_211 to w_b7_220');
