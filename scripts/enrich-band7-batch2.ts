import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_11": {
    "synonyms": ["theoretical", "abstract", "notional", "hypothetical"],
    "wordFamily": { "noun": ["concept", "conception", "conceptualization"], "verb": ["conceptualize"], "adj": ["conceptual"], "adv": ["conceptually"] }
  },
  "w_b7_12": {
    "synonyms": ["situational", "environmental", "circumstantial"],
    "wordFamily": { "noun": ["context"], "verb": ["contextualize"], "adj": ["contextual"], "adv": ["contextually"] }
  },
  "w_b7_13": {
    "synonyms": ["discussion", "conversation", "dialogue", "debate"],
    "wordFamily": { "noun": ["discourse"], "verb": ["discourse"] }
  },
  "w_b7_14": {
    "synonyms": ["beliefs", "ideas", "principles", "doctrine"],
    "wordFamily": { "noun": ["ideology", "ideologue"], "adj": ["ideological"], "adv": ["ideologically"] }
  },
  "w_b7_15": {
    "synonyms": ["validity", "legality", "authenticity", "rightfulness"],
    "wordFamily": { "noun": ["legitimacy"], "verb": ["legitimize"], "adj": ["legitimate"], "adv": ["legitimately"] }
  },
  "w_b7_16": {
    "synonyms": ["display", "demonstration", "expression", "sign"],
    "wordFamily": { "noun": ["manifestation"], "verb": ["manifest"], "adj": ["manifest"], "adv": ["manifestly"] }
  },
  "w_b7_17": {
    "synonyms": ["standard", "prescriptive", "evaluative"],
    "wordFamily": { "noun": ["norm"], "adj": ["normative"] }
  },
  "w_b7_18": {
    "synonyms": ["bias", "prejudice", "individuality", "personalization"],
    "wordFamily": { "noun": ["subjectivity", "subject"], "adj": ["subjective"], "adv": ["subjectively"] }
  },
  "w_b7_19": {
    "synonyms": ["hypothetical", "abstract", "conceptual", "academic"],
    "wordFamily": { "noun": ["theory", "theorist"], "verb": ["theorize"], "adj": ["theoretical"], "adv": ["theoretically"] }
  },
  "w_b7_20": {
    "synonyms": ["structural", "institutional", "comprehensive", "widespread"],
    "wordFamily": { "noun": ["system"], "verb": ["systematize"], "adj": ["systemic", "systematic"], "adv": ["systemically", "systematically"] }
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
console.log('Enriched w_b7_11 to w_b7_20');
