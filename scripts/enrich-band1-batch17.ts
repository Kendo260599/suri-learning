import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_161": {
    "synonyms": ["gash", "slash", "incision", "wound"],
    "wordFamily": {
      "noun": ["cut", "cutter", "cutting"],
      "verb": ["cut"],
      "adj": ["cutting"]
    }
  },
  "w_b1_162": {
    "synonyms": ["scrape", "graze", "mark"],
    "wordFamily": {
      "noun": ["scratch"],
      "verb": ["scratch"],
      "adj": ["scratchy"]
    }
  },
  "w_b1_163": {
    "synonyms": ["scald", "sear", "scorch"],
    "wordFamily": {
      "noun": ["burn", "burner", "burning"],
      "verb": ["burn"],
      "adj": ["burning"]
    }
  },
  "w_b1_164": {
    "synonyms": ["prick", "smart", "bite"],
    "wordFamily": {
      "noun": ["sting", "stinger"],
      "verb": ["sting"],
      "adj": ["stinging"]
    }
  },
  "w_b1_165": {
    "synonyms": ["gnaw", "chew", "nip", "morsel"],
    "wordFamily": {
      "noun": ["bite"],
      "verb": ["bite"],
      "adj": ["biting"]
    }
  },
  "w_b1_166": {
    "synonyms": ["lose blood", "weep"],
    "wordFamily": {
      "noun": ["bleed", "bleeding", "blood"],
      "verb": ["bleed"],
      "adj": ["bloody"]
    }
  },
  "w_b1_167": {
    "synonyms": ["pass out", "swoon", "collapse", "dim"],
    "antonyms": ["conscious", "strong"],
    "wordFamily": {
      "noun": ["faint", "faintness"],
      "verb": ["faint"],
      "adj": ["faint"],
      "adv": ["faintly"]
    }
  },
  "w_b1_168": {
    "synonyms": ["light-headed", "giddy", "unsteady"],
    "wordFamily": {
      "noun": ["dizziness"],
      "adj": ["dizzy"]
    }
  },
  "w_b1_169": {
    "synonyms": ["sick", "queasy", "ill"],
    "wordFamily": {
      "noun": ["nausea"],
      "adj": ["nauseous"]
    }
  },
  "w_b1_170": {
    "synonyms": ["throw up", "retch", "heave"],
    "wordFamily": {
      "noun": ["vomit"],
      "verb": ["vomit"]
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
console.log('Enriched Batch 17 of Band 1 vocabulary successfully.');
