import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_121": {
    "synonyms": ["bandage", "dressing", "adhesive"],
    "wordFamily": {
      "noun": ["plaster"],
      "verb": ["plaster"]
    }
  },
  "w_b1_122": {
    "synonyms": ["medication", "drug", "cure", "remedy"],
    "wordFamily": {
      "noun": ["medicine", "medical", "medication"],
      "adj": ["medical", "medicinal"]
    }
  },
  "w_b1_123": {
    "synonyms": ["tablet", "capsule", "pellet"],
    "wordFamily": {
      "noun": ["pill"]
    }
  },
  "w_b1_124": {
    "synonyms": ["pill", "capsule", "pad", "slab"],
    "wordFamily": {
      "noun": ["tablet"]
    }
  },
  "w_b1_125": {
    "synonyms": ["instruction", "order", "recipe"],
    "wordFamily": {
      "noun": ["prescription", "prescriber"],
      "verb": ["prescribe"],
      "adj": ["prescriptive"]
    }
  },
  "w_b1_126": {
    "synonyms": ["meeting", "engagement", "rendezvous"],
    "wordFamily": {
      "noun": ["appointment", "appointee"],
      "verb": ["appoint"]
    }
  },
  "w_b1_127": {
    "synonyms": ["sick person", "case", "forbearing", "tolerant"],
    "antonyms": ["impatient"],
    "wordFamily": {
      "noun": ["patient", "patience"],
      "adj": ["patient"],
      "adv": ["patiently"]
    }
  },
  "w_b1_128": {
    "synonyms": ["caregiver", "attendant", "nanny"],
    "wordFamily": {
      "noun": ["nurse", "nursery", "nursing"],
      "verb": ["nurse"]
    }
  },
  "w_b1_129": {
    "synonyms": ["physician", "clinician", "medic"],
    "wordFamily": {
      "noun": ["doctor", "doctorate"],
      "verb": ["doctor"],
      "adj": ["doctoral"]
    }
  },
  "w_b1_130": {
    "synonyms": ["dental surgeon"],
    "wordFamily": {
      "noun": ["dentist", "dentistry", "denture"],
      "adj": ["dental"]
    }
  }
};

for (const [id, data] of Object.entries(enrichments)) {
  const regex = new RegExp(`("id":\\s*"${id}",[\\s\\S]*?)(topicId":\\s*"[^"]*")`, 'g');
  
  let replacement = `$1$2`;
  if (data.synonyms) {
    replacement += `,\n    "synonyms": ${JSON.stringify(data.synonyms, null, 2).replace(/\n/g, '\n    ')}`;
  }
  if (data.antonyms) {
    replacement += `,\n    "antonyms": ${JSON.stringify(data.antonyms, null, 2).replace(/\n/g, '\n    ')}`;
  }
  if (data.wordFamily) {
    replacement += `,\n    "wordFamily": ${JSON.stringify(data.wordFamily, null, 2).replace(/\n/g, '\n    ')}`;
  }

  content = content.replace(regex, replacement);
}

fs.writeFileSync(filePath, content);
console.log('Enriched Batch 13 of Band 1 vocabulary successfully.');
