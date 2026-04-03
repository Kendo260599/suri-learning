import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b6_81": {
    "synonyms": ["absolutism", "tyranny", "despotism", "dictatorship"],
    "wordFamily": { "noun": ["autocracy", "autocrat"], "adj": ["autocratic"], "adv": ["autocratically"] }
  },
  "w_b6_82": {
    "synonyms": ["rule", "law", "statute", "directive"],
    "wordFamily": { "noun": ["regulation", "regulator"], "verb": ["regulate"], "adj": ["regulatory"] }
  },
  "w_b6_83": {
    "synonyms": ["administration", "red tape", "officials", "government"],
    "wordFamily": { "noun": ["bureaucracy", "bureaucrat"], "adj": ["bureaucratic"], "adv": ["bureaucratically"] }
  },
  "w_b6_84": {
    "synonyms": ["statesmanship", "negotiation", "tact", "discretion"],
    "wordFamily": { "noun": ["diplomacy", "diplomat"], "adj": ["diplomatic"], "adv": ["diplomatically"] }
  },
  "w_b6_85": {
    "synonyms": ["envoy", "emissary", "representative", "diplomat"],
    "wordFamily": { "noun": ["ambassador", "ambassadress"], "adj": ["ambassadorial"] }
  },
  "w_b6_86": {
    "synonyms": ["mission", "consulate", "delegation"],
    "wordFamily": { "noun": ["embassy"] }
  },
  "w_b6_87": {
    "synonyms": ["mission", "office", "agency"],
    "wordFamily": { "noun": ["consulate", "consul"], "adj": ["consular"] }
  },
  "w_b6_88": {
    "synonyms": ["agreement", "pact", "accord", "compact"],
    "wordFamily": { "noun": ["treaty"] }
  },
  "w_b6_89": {
    "synonyms": ["partnership", "association", "union", "league"],
    "wordFamily": { "noun": ["alliance", "ally"], "verb": ["ally"], "adj": ["allied"] }
  },
  "w_b6_90": {
    "synonyms": ["penalty", "punishment", "authorization", "permission"],
    "wordFamily": { "noun": ["sanction"], "verb": ["sanction"] }
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
console.log('Enriched w_b6_81 to w_b6_90');
