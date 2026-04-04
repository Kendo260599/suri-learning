import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_61": {
    "synonyms": ["doubt", "disbelief", "cynicism", "suspicion"],
    "wordFamily": { "noun": ["skepticism", "skeptic"], "adj": ["skeptical"], "adv": ["skeptically"] }
  },
  "w_b7_62": {
    "synonyms": ["subjectivism", "pluralism", "perspectivism"],
    "wordFamily": { "noun": ["relativism", "relativist"], "adj": ["relativistic"] }
  },
  "w_b7_63": {
    "synonyms": ["autocracy", "dictatorship", "totalitarianism", "despotism"],
    "wordFamily": { "noun": ["absolutism", "absolutist"], "adj": ["absolute"], "adv": ["absolutely"] }
  },
  "w_b7_64": {
    "synonyms": ["diversity", "multiculturalism", "variety", "heterogeneity"],
    "wordFamily": { "noun": ["pluralism", "pluralist"], "adj": ["pluralistic"] }
  },
  "w_b7_65": {
    "synonyms": ["reasoning", "argumentation", "debate", "logic"],
    "wordFamily": { "noun": ["dialectic", "dialectics"], "adj": ["dialectical"] }
  },
  "w_b7_66": {
    "synonyms": ["interpretation", "exegesis", "analysis"],
    "wordFamily": { "noun": ["hermeneutics"], "adj": ["hermeneutic"] }
  },
  "w_b7_67": {
    "synonyms": ["consumerism", "commercialism", "greed", "acquisitiveness"],
    "wordFamily": { "noun": ["materialism", "materialist"], "adj": ["materialistic"], "adv": ["materialistically"] }
  },
  "w_b7_68": {
    "synonyms": ["hedonism", "sensualism", "voluptuousness"],
    "wordFamily": { "noun": ["epicureanism", "epicure"], "adj": ["epicurean"] }
  },
  "w_b7_69": {
    "synonyms": ["skepticism", "doubt", "uncertainty", "unbelief"],
    "wordFamily": { "noun": ["agnosticism", "agnostic"], "adj": ["agnostic"] }
  },
  "w_b7_70": {
    "synonyms": ["nonbelief", "disbelief", "godlessness", "skepticism"],
    "wordFamily": { "noun": ["atheism", "atheist"], "adj": ["atheistic"] }
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
console.log('Enriched w_b7_61 to w_b7_70');
