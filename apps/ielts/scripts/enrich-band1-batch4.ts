import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_31": {
    "synonyms": ["little", "tiny", "miniature", "slight"],
    "antonyms": ["big", "large", "huge", "enormous"],
    "wordFamily": {
      "noun": ["smallness"],
      "adj": ["small"],
      "adv": ["smallly"]
    }
  },
  "w_b1_32": {
    "synonyms": ["boiling", "scorching", "warm", "heated"],
    "antonyms": ["cold", "chilly", "freezing", "cool"],
    "wordFamily": {
      "noun": ["heat"],
      "verb": ["heat"],
      "adj": ["hot", "heated"],
      "adv": ["hotly"]
    }
  },
  "w_b1_33": {
    "synonyms": ["chilly", "freezing", "icy", "cool"],
    "antonyms": ["hot", "warm", "boiling"],
    "wordFamily": {
      "noun": ["cold", "coldness"],
      "adj": ["cold"],
      "adv": ["coldly"]
    }
  },
  "w_b1_34": {
    "synonyms": ["galley", "scullery", "cookhouse"],
    "wordFamily": {
      "noun": ["kitchen", "kitchenette"],
      "adj": ["kitchen"]
    }
  },
  "w_b1_35": {
    "synonyms": ["sleeping room", "chamber", "guest room"],
    "wordFamily": {
      "noun": ["bedroom"]
    }
  },
  "w_b1_36": {
    "synonyms": ["restroom", "washroom", "lavatory", "toilet"],
    "wordFamily": {
      "noun": ["bathroom"]
    }
  },
  "w_b1_37": {
    "synonyms": ["yard", "lawn", "park", "plot"],
    "wordFamily": {
      "noun": ["garden", "gardener", "gardening"],
      "verb": ["garden"]
    }
  },
  "w_b1_38": {
    "synonyms": ["pane", "opening", "casement"],
    "wordFamily": {
      "noun": ["window", "windowsill"]
    }
  },
  "w_b1_39": {
    "synonyms": ["entrance", "entry", "gateway", "portal"],
    "wordFamily": {
      "noun": ["door", "doorway", "doorstep"]
    }
  },
  "w_b1_40": {
    "synonyms": ["ground", "deck", "base", "bottom"],
    "antonyms": ["ceiling", "roof"],
    "wordFamily": {
      "noun": ["floor", "flooring"]
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
console.log('Enriched Batch 4 of Band 1 vocabulary successfully.');
