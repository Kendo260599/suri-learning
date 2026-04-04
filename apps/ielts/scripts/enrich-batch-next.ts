import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b5_201": {
    "synonyms": ["bargain", "discuss", "mediate"],
    "wordFamily": { "noun": ["negotiation", "negotiator"], "verb": ["negotiate"], "adj": ["negotiable"] }
  },
  "w_b6_1": {
    "synonyms": ["model", "pattern", "example", "standard"],
    "wordFamily": { "noun": ["paradigm"], "adj": ["paradigmatic"] }
  },
  "w_b6_2": {
    "synonyms": ["framework", "base", "foundation", "structure"],
    "wordFamily": { "noun": ["infrastructure"], "adj": ["infrastructural"] }
  },
  "w_b6_3": {
    "synonyms": ["internationalization", "integration"],
    "wordFamily": { "noun": ["globalization", "globe"], "verb": ["globalize"], "adj": ["global"], "adv": ["globally"] }
  },
  "w_b6_4": {
    "synonyms": ["urban sprawl", "city growth"],
    "wordFamily": { "noun": ["urbanization", "urbanism"], "verb": ["urbanize"], "adj": ["urban"] }
  },
  "w_b6_5": {
    "synonyms": ["digitization", "automation"],
    "wordFamily": { "noun": ["digitalization", "digit"], "verb": ["digitalize", "digitize"], "adj": ["digital"], "adv": ["digitally"] }
  },
  "w_b6_6": {
    "synonyms": ["mechanization", "computerization"],
    "wordFamily": { "noun": ["automation", "automaton"], "verb": ["automate"], "adj": ["automatic"], "adv": ["automatically"] }
  },
  "w_b6_7": {
    "synonyms": ["unclear", "vague", "equivocal", "obscure"],
    "wordFamily": { "noun": ["ambiguity"], "adj": ["ambiguous"], "adv": ["ambiguously"] }
  },
  "w_b6_8": {
    "synonyms": ["logical", "consistent", "rational", "lucid"],
    "wordFamily": { "noun": ["coherence", "cohesion"], "adj": ["coherent", "cohesive"], "adv": ["coherently"] }
  },
  "w_b6_9": {
    "synonyms": ["contentious", "disputed", "debatable"],
    "wordFamily": { "noun": ["controversy"], "adj": ["controversial"], "adv": ["controversially"] }
  },
  "w_b6_10": {
    "synonyms": ["observed", "experimental", "factual", "practical"],
    "wordFamily": { "noun": ["empiricism", "empiricist"], "adj": ["empirical"], "adv": ["empirically"] }
  }
};

for (const [id, data] of Object.entries(enrichments)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
  const replacement = `$1,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
  
  if (content.includes(`"id": "${id}"`) && !content.includes(`"id": "${id}"` + '[\s\S]*?"synonyms":')) {
      content = content.replace(regex, replacement);
  }
}

fs.writeFileSync(vocabPath, content);
console.log('Enriched w_b5_201 and w_b6_1 to w_b6_10');
