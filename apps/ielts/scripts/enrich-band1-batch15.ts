import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_141": {
    "synonyms": ["sickness", "ailment", "malady", "disease"],
    "antonyms": ["health", "wellness"],
    "wordFamily": {
      "noun": ["illness", "ill"],
      "adj": ["ill"]
    }
  },
  "w_b1_142": {
    "synonyms": ["illness", "sickness", "ailment", "infection"],
    "antonyms": ["health"],
    "wordFamily": {
      "noun": ["disease"],
      "adj": ["diseased"]
    }
  },
  "w_b1_143": {
    "synonyms": ["indication", "sign", "signal", "manifestation"],
    "wordFamily": {
      "noun": ["symptom"],
      "adj": ["symptomatic"]
    }
  },
  "w_b1_144": {
    "synonyms": ["high temperature", "pyrexia", "feverishness"],
    "wordFamily": {
      "noun": ["fever"],
      "adj": ["feverish"]
    }
  },
  "w_b1_145": {
    "synonyms": ["hack", "bark"],
    "wordFamily": {
      "noun": ["cough"],
      "verb": ["cough"]
    }
  },
  "w_b1_146": {
    "synonyms": ["sternutation"],
    "wordFamily": {
      "noun": ["sneeze"],
      "verb": ["sneeze"]
    }
  },
  "w_b1_147": {
    "synonyms": ["migraine", "cephalalgia"],
    "wordFamily": {
      "noun": ["headache", "head", "ache"]
    }
  },
  "w_b1_148": {
    "synonyms": ["stomach pain", "tummy ache"],
    "wordFamily": {
      "noun": ["stomach ache", "stomach", "ache"]
    }
  },
  "w_b1_149": {
    "synonyms": ["tooth pain"],
    "wordFamily": {
      "noun": ["toothache", "tooth", "ache"]
    }
  },
  "w_b1_150": {
    "synonyms": ["back pain"],
    "wordFamily": {
      "noun": ["backache", "back", "ache"]
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
console.log('Enriched Batch 15 of Band 1 vocabulary successfully.');
