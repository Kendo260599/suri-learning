import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix w_b1_170 (Copper)
const copperFix = {
  "id": "w_b1_170",
  "synonyms": ["cuprum", "red metal"],
  "wordFamily": {
    "noun": ["copper", "coppice"],
    "verb": ["copper"],
    "adj": ["coppery"]
  }
};

const enrichments: Record<string, any> = {
  "w_b1_171": {
    "synonyms": ["aurum", "yellow metal"],
    "wordFamily": {
      "noun": ["gold", "goldsmith"],
      "adj": ["golden"]
    }
  },
  "w_b1_172": {
    "synonyms": ["argentum", "white metal"],
    "wordFamily": {
      "noun": ["silver", "silversmith"],
      "adj": ["silvery"]
    }
  },
  "w_b1_173": {
    "synonyms": ["aluminium"],
    "wordFamily": {
      "noun": ["aluminum"]
    }
  },
  "w_b1_174": {
    "synonyms": ["synthetic", "polymer", "moldable"],
    "wordFamily": {
      "noun": ["plastic", "plasticity"],
      "adj": ["plastic"]
    }
  },
  "w_b1_175": {
    "synonyms": ["latex", "elastic", "eraser"],
    "wordFamily": {
      "noun": ["rubber"],
      "adj": ["rubbery"]
    }
  },
  "w_b1_176": {
    "synonyms": ["timber", "lumber", "forest", "grove"],
    "wordFamily": {
      "noun": ["wood", "woodland", "woodwork"],
      "adj": ["wooden", "woody"]
    }
  },
  "w_b1_177": {
    "synonyms": ["wood", "lumber"],
    "wordFamily": {
      "noun": ["timber"]
    }
  },
  "w_b1_178": {
    "synonyms": ["sheet", "leaf", "newspaper", "journal"],
    "wordFamily": {
      "noun": ["paper", "paperwork"],
      "verb": ["paper"],
      "adj": ["papery"]
    }
  },
  "w_b1_179": {
    "synonyms": ["pasteboard", "stiff paper"],
    "wordFamily": {
      "noun": ["cardboard"]
    }
  },
  "w_b1_180": {
    "synonyms": ["boll", "fiber", "thread"],
    "wordFamily": {
      "noun": ["cotton"],
      "adj": ["cottony"]
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
console.log('Enriched Batch 18 of Band 1 vocabulary successfully.');
