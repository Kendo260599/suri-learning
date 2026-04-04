import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_51": {
    "synonyms": ["phone", "handset", "receiver"],
    "wordFamily": {
      "noun": ["telephone", "telephony"],
      "verb": ["telephone"],
      "adj": ["telephonic"]
    }
  },
  "w_b1_52": {
    "synonyms": ["portable", "movable", "cell phone"],
    "antonyms": ["fixed", "stationary", "immobile"],
    "wordFamily": {
      "noun": ["mobility", "mobilization"],
      "verb": ["mobilize"],
      "adj": ["mobile"]
    }
  },
  "w_b1_53": {
    "synonyms": ["web", "world wide web", "cyberspace"],
    "wordFamily": {
      "noun": ["internet", "internaut"]
    }
  },
  "w_b1_54": {
    "synonyms": ["roof", "upper limit", "vault"],
    "antonyms": ["floor"],
    "wordFamily": {
      "noun": ["ceiling"]
    }
  },
  "w_b1_55": {
    "synonyms": ["top", "cover", "canopy"],
    "antonyms": ["floor", "foundation"],
    "wordFamily": {
      "noun": ["roof", "roofer", "roofing"],
      "verb": ["roof"]
    }
  },
  "w_b1_56": {
    "synonyms": ["staircase", "stairway", "steps"],
    "wordFamily": {
      "noun": ["stairs", "stairwell", "stairway"]
    }
  },
  "w_b1_57": {
    "synonyms": ["carport", "shed", "workshop"],
    "wordFamily": {
      "noun": ["garage"],
      "verb": ["garage"]
    }
  },
  "w_b1_58": {
    "synonyms": ["lounge", "sitting room", "parlor", "family room"],
    "wordFamily": {
      "noun": ["living room"]
    }
  },
  "w_b1_59": {
    "synonyms": ["refectory", "mess hall"],
    "wordFamily": {
      "noun": ["dining room"]
    }
  },
  "w_b1_60": {
    "synonyms": ["berth", "bunk", "cot", "couch"],
    "wordFamily": {
      "noun": ["bed", "bedding", "bedroom", "bedspread"],
      "verb": ["bed"]
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
console.log('Enriched Batch 6 of Band 1 vocabulary successfully.');
