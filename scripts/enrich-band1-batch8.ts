import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_71": {
    "synonyms": ["court", "courtyard", "garden", "enclosure"],
    "wordFamily": {
      "noun": ["yard", "yardstick", "yardarm"]
    }
  },
  "w_b1_72": {
    "synonyms": ["cellar", "vault", "crypt"],
    "antonyms": ["attic", "loft"],
    "wordFamily": {
      "noun": ["basement"]
    }
  },
  "w_b1_73": {
    "synonyms": ["loft", "garret"],
    "antonyms": ["basement", "cellar"],
    "wordFamily": {
      "noun": ["attic"]
    }
  },
  "w_b1_74": {
    "synonyms": ["corridor", "passage", "aisle", "lobby"],
    "wordFamily": {
      "noun": ["hallway"]
    }
  },
  "w_b1_75": {
    "synonyms": ["flue", "stack", "vent"],
    "wordFamily": {
      "noun": ["chimney", "chimneypot", "chimneysweep"]
    }
  },
  "w_b1_76": {
    "synonyms": ["hearth", "grate", "ingle"],
    "wordFamily": {
      "noun": ["fireplace"]
    }
  },
  "w_b1_77": {
    "synonyms": ["shade", "shutter", "screen"],
    "wordFamily": {
      "noun": ["blind", "blindness"],
      "verb": ["blind"],
      "adj": ["blind"]
    }
  },
  "w_b1_78": {
    "synonyms": ["rug", "mat", "flooring"],
    "wordFamily": {
      "noun": ["carpet", "carpeting"],
      "verb": ["carpet"]
    }
  },
  "w_b1_79": {
    "synonyms": ["pad", "buffer", "bolster", "pillow"],
    "wordFamily": {
      "noun": ["cushion"],
      "verb": ["cushion"]
    }
  },
  "w_b1_80": {
    "synonyms": ["bolster", "headrest", "cushion"],
    "wordFamily": {
      "noun": ["pillow", "pillowcase"],
      "verb": ["pillow"]
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
console.log('Enriched Batch 8 of Band 1 vocabulary successfully.');
