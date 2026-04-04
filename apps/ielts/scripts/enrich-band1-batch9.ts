import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_81": {
    "synonyms": ["cover", "coverlet", "quilt", "rug"],
    "wordFamily": {
      "noun": ["blanket"],
      "verb": ["blanket"],
      "adj": ["blanket"]
    }
  },
  "w_b1_82": {
    "synonyms": ["layer", "film", "coating", "leaf"],
    "wordFamily": {
      "noun": ["sheet", "sheeting"],
      "verb": ["sheet"]
    }
  },
  "w_b1_83": {
    "synonyms": ["quilt", "eiderdown", "comforter"],
    "wordFamily": {
      "noun": ["duvet"]
    }
  },
  "w_b1_84": {
    "synonyms": ["pad", "cushion", "bedding"],
    "wordFamily": {
      "noun": ["mattress"]
    }
  },
  "w_b1_85": {
    "synonyms": ["cloth", "wipe", "absorbent"],
    "wordFamily": {
      "noun": ["towel", "towelling"],
      "verb": ["towel"]
    }
  },
  "w_b1_86": {
    "synonyms": ["detergent", "cleanser", "lather"],
    "wordFamily": {
      "noun": ["soap", "soapstone", "soapsuds"],
      "verb": ["soap"],
      "adj": ["soapy"]
    }
  },
  "w_b1_87": {
    "synonyms": ["hair wash", "cleanser"],
    "wordFamily": {
      "noun": ["shampoo"],
      "verb": ["shampoo"]
    }
  },
  "w_b1_88": {
    "synonyms": ["softener", "balm", "rinse"],
    "wordFamily": {
      "noun": ["conditioner", "condition", "conditioning"],
      "verb": ["condition"],
      "adj": ["conditional"]
    }
  },
  "w_b1_89": {
    "synonyms": ["dentifrice"],
    "wordFamily": {
      "noun": ["toothpaste", "tooth", "paste"]
    }
  },
  "w_b1_90": {
    "synonyms": ["dental brush"],
    "wordFamily": {
      "noun": ["toothbrush", "tooth", "brush"]
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
console.log('Enriched Batch 9 of Band 1 vocabulary successfully.');
