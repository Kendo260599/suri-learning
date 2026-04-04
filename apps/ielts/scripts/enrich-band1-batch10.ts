import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_91": {
    "synonyms": ["untangle", "arrange", "groom"],
    "wordFamily": {
      "noun": ["comb"],
      "verb": ["comb"]
    }
  },
  "w_b1_92": {
    "synonyms": ["broom", "sweeper", "scrubber"],
    "wordFamily": {
      "noun": ["brush", "brushwood", "brushwork"],
      "verb": ["brush"],
      "adj": ["brushy"]
    }
  },
  "w_b1_93": {
    "synonyms": ["shaver", "blade"],
    "wordFamily": {
      "noun": ["razor", "razorbill"],
      "verb": ["razor"]
    }
  },
  "w_b1_94": {
    "synonyms": ["shears", "clippers", "cutters"],
    "wordFamily": {
      "noun": ["scissors"],
      "verb": ["scissor"]
    }
  },
  "w_b1_95": {
    "synonyms": ["pin", "spike", "stylus"],
    "wordFamily": {
      "noun": ["needle", "needlework"],
      "verb": ["needle"]
    }
  },
  "w_b1_96": {
    "synonyms": ["string", "yarn", "filament", "fiber"],
    "wordFamily": {
      "noun": ["thread", "threadbare"],
      "verb": ["thread"],
      "adj": ["thready"]
    }
  },
  "w_b1_97": {
    "synonyms": ["fastener", "stud", "knob", "badge"],
    "wordFamily": {
      "noun": ["button", "buttonhole"],
      "verb": ["button"]
    }
  },
  "w_b1_98": {
    "synonyms": ["zipper", "fastener"],
    "wordFamily": {
      "noun": ["zip", "zipper"],
      "verb": ["zip"]
    }
  },
  "w_b1_99": {
    "synonyms": ["pouch", "bag", "compartment"],
    "wordFamily": {
      "noun": ["pocket", "pocketbook"],
      "verb": ["pocket"]
    }
  },
  "w_b1_100": {
    "synonyms": ["strap", "girdle", "band", "sash"],
    "wordFamily": {
      "noun": ["belt", "belting"],
      "verb": ["belt"]
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
console.log('Enriched Batch 10 of Band 1 vocabulary successfully.');
