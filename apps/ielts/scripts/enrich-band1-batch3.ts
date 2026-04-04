import * as fs from 'fs';
import * as path from 'path';

const VOCAB_PATH = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData: Record<string, any> = {
  "w_b1_21": {
    "synonyms": ["physician", "clinician", "medical practitioner"],
    "antonyms": ["patient"],
    "wordFamily": {
      "noun": ["doctor", "doctorate"],
      "verb": ["doctor"],
      "adj": ["doctoral"]
    }
  },
  "w_b1_22": {
    "synonyms": ["caregiver", "medical assistant"],
    "wordFamily": {
      "noun": ["nurse", "nursing"],
      "verb": ["nurse"],
      "adj": ["nursery"]
    }
  },
  "w_b1_23": {
    "synonyms": ["medical center", "clinic", "infirmary"],
    "wordFamily": {
      "noun": ["hospital", "hospitalization"],
      "verb": ["hospitalize"],
      "adj": ["hospitable"]
    }
  },
  "w_b1_24": {
    "synonyms": ["medication", "drug", "remedy"],
    "wordFamily": {
      "noun": ["medicine"],
      "adj": ["medical", "medicinal"],
      "adv": ["medically"]
    }
  },
  "w_b1_25": {
    "synonyms": ["well-being", "fitness", "wellness"],
    "antonyms": ["illness", "sickness", "disease"],
    "wordFamily": {
      "noun": ["health", "healthiness"],
      "adj": ["healthy", "healthful"],
      "adv": ["healthily"]
    }
  },
  "w_b1_26": {
    "synonyms": ["academy", "institute", "educational institution"],
    "wordFamily": {
      "noun": ["school", "schooling"],
      "verb": ["school"],
      "adj": ["scholastic"]
    }
  },
  "w_b1_27": {
    "synonyms": ["college", "varsity"],
    "wordFamily": {
      "noun": ["university"]
    }
  },
  "w_b1_28": {
    "synonyms": ["lesson", "course", "session"],
    "wordFamily": {
      "noun": ["class", "classroom"],
      "verb": ["classify"],
      "adj": ["classic"]
    }
  },
  "w_b1_29": {
    "synonyms": ["assignment", "schoolwork"],
    "wordFamily": {
      "noun": ["homework"]
    }
  },
  "w_b1_30": {
    "synonyms": ["test", "assessment", "evaluation"],
    "wordFamily": {
      "noun": ["exam", "examination"],
      "verb": ["examine"],
      "adj": ["examinable"]
    }
  }
};

function enrichVocab() {
  let content = fs.readFileSync(VOCAB_PATH, 'utf-8');
  
  for (const [id, data] of Object.entries(enrichmentData)) {
    const regex = new RegExp(`("id":\\s*"${id}",[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
    const match = content.match(regex);
    
    if (match) {
      const original = match[0];
      let enriched = original;
      
      if (data.synonyms) {
        enriched += `,\n    "synonyms": ${JSON.stringify(data.synonyms, null, 2).replace(/\n/g, '\n    ')}`;
      }
      if (data.antonyms) {
        enriched += `,\n    "antonyms": ${JSON.stringify(data.antonyms, null, 2).replace(/\n/g, '\n    ')}`;
      }
      if (data.wordFamily) {
        enriched += `,\n    "wordFamily": ${JSON.stringify(data.wordFamily, null, 2).replace(/\n/g, '\n    ')}`;
      }
      
      content = content.replace(original, enriched);
    }
  }
  
  fs.writeFileSync(VOCAB_PATH, content);
  console.log('Successfully enriched Band 1 words (batch 3).');
}

enrichVocab();
