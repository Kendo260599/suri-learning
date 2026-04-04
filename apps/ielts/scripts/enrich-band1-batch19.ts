import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_181": {
    "synonyms": ["fleece", "yarn", "hair"],
    "wordFamily": {
      "noun": ["wool", "woollen", "woolliness"],
      "adj": ["woollen", "woolly"]
    }
  },
  "w_b1_182": {
    "synonyms": ["fiber", "thread", "lustrous"],
    "wordFamily": {
      "noun": ["silk", "silkworm", "silkiness"],
      "adj": ["silky", "silken"]
    }
  },
  "w_b1_183": {
    "synonyms": ["hide", "skin", "parchment"],
    "wordFamily": {
      "noun": ["leather", "leatherette"],
      "adj": ["leathery"]
    }
  },
  "w_b1_184": {
    "synonyms": ["pelt", "hair", "coat"],
    "wordFamily": {
      "noun": ["fur", "furrier"],
      "adj": ["furry"]
    }
  },
  "w_b1_185": {
    "synonyms": ["alloy", "element", "ore"],
    "wordFamily": {
      "noun": ["metal", "metallurgy"],
      "adj": ["metallic"]
    }
  },
  "w_b1_186": {
    "synonyms": ["earth", "soil", "land", "floor", "terrain"],
    "wordFamily": {
      "noun": ["ground", "grounding", "groundwork"],
      "verb": ["ground"],
      "adj": ["groundless"]
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
console.log('Enriched Batch 19 of Band 1 vocabulary successfully.');
