import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_111": {
    "synonyms": ["bangle", "armlet", "wristband"],
    "wordFamily": {
      "noun": ["bracelet"]
    }
  },
  "w_b1_112": {
    "synonyms": ["stud", "pendant", "hoop"],
    "wordFamily": {
      "noun": ["earring", "ear"]
    }
  },
  "w_b1_113": {
    "synonyms": ["spectacles", "eyeglasses", "specs"],
    "wordFamily": {
      "noun": ["glasses", "glass", "glassware"],
      "adj": ["glassy"]
    }
  },
  "w_b1_114": {
    "synonyms": ["shades", "dark glasses"],
    "wordFamily": {
      "noun": ["sunglasses", "sun", "glasses"]
    }
  },
  "w_b1_115": {
    "synonyms": ["contacts", "lenses"],
    "wordFamily": {
      "noun": ["contact lens", "contact", "lens"]
    }
  },
  "w_b1_116": {
    "synonyms": ["audio aid", "deaf aid"],
    "wordFamily": {
      "noun": ["hearing aid", "hearing", "aid"]
    }
  },
  "w_b1_117": {
    "synonyms": ["invalid chair"],
    "wordFamily": {
      "noun": ["wheelchair", "wheel", "chair"]
    }
  },
  "w_b1_118": {
    "synonyms": ["cane", "staff"],
    "wordFamily": {
      "noun": ["walking stick", "walking", "stick"]
    }
  },
  "w_b1_119": {
    "synonyms": ["support", "prop", "stay"],
    "wordFamily": {
      "noun": ["crutch"]
    }
  },
  "w_b1_120": {
    "synonyms": ["dressing", "binding", "plaster"],
    "wordFamily": {
      "noun": ["bandage"],
      "verb": ["bandage"]
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
console.log('Enriched Batch 12 of Band 1 vocabulary successfully.');
