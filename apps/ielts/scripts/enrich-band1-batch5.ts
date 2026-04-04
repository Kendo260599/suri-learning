import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_41": {
    "synonyms": ["partition", "barrier", "divider", "screen"],
    "wordFamily": {
      "noun": ["wall", "wallpaper", "wallflower"],
      "verb": ["wall"]
    }
  },
  "w_b1_42": {
    "synonyms": ["seat", "armchair", "stool", "bench"],
    "wordFamily": {
      "noun": ["chair", "chairperson", "chairman", "chairwoman"],
      "verb": ["chair"]
    }
  },
  "w_b1_43": {
    "synonyms": ["desk", "stand", "counter", "board"],
    "wordFamily": {
      "noun": ["table", "tablet", "tabletop", "tableware"],
      "verb": ["table"]
    }
  },
  "w_b1_44": {
    "synonyms": ["timepiece", "timer", "chronometer", "watch"],
    "wordFamily": {
      "noun": ["clock", "clockwork"],
      "verb": ["clock"]
    }
  },
  "w_b1_45": {
    "synonyms": ["light", "lantern", "torch", "beacon"],
    "wordFamily": {
      "noun": ["lamp", "lampshade", "lamppost"]
    }
  },
  "w_b1_46": {
    "synonyms": ["looking glass", "reflector", "speculum"],
    "wordFamily": {
      "noun": ["mirror"],
      "verb": ["mirror"]
    }
  },
  "w_b1_47": {
    "synonyms": ["photo", "image", "painting", "drawing", "portrait"],
    "wordFamily": {
      "noun": ["picture", "pictogram"],
      "verb": ["picture"],
      "adj": ["pictorial"]
    }
  },
  "w_b1_48": {
    "synonyms": ["wireless", "receiver", "tuner"],
    "wordFamily": {
      "noun": ["radio", "radiology", "radiator"],
      "verb": ["radio"]
    }
  },
  "w_b1_49": {
    "synonyms": ["TV", "telly", "the tube", "small screen"],
    "wordFamily": {
      "noun": ["television", "televisor"],
      "verb": ["televise"],
      "adj": ["televisual"]
    }
  },
  "w_b1_50": {
    "synonyms": ["PC", "laptop", "workstation", "processor"],
    "wordFamily": {
      "noun": ["computer", "computation", "computing"],
      "verb": ["compute"],
      "adj": ["computational"]
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
console.log('Enriched Batch 5 of Band 1 vocabulary successfully.');
