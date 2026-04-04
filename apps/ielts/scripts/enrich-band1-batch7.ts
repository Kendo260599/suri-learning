import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_61": {
    "synonyms": ["couch", "settee", "divan"],
    "wordFamily": {
      "noun": ["sofa", "sofabed"]
    }
  },
  "w_b1_62": {
    "synonyms": ["cabinet", "closet", "locker", "pantry"],
    "wordFamily": {
      "noun": ["cupboard"]
    }
  },
  "w_b1_63": {
    "synonyms": ["ledge", "mantel", "rack"],
    "wordFamily": {
      "noun": ["shelf", "shelving", "bookshelf"],
      "verb": ["shelve"]
    }
  },
  "w_b1_64": {
    "synonyms": ["drape", "blind", "screen", "veil"],
    "wordFamily": {
      "noun": ["curtain"],
      "verb": ["curtain"]
    }
  },
  "w_b1_65": {
    "synonyms": ["carpet", "mat", "runner"],
    "wordFamily": {
      "noun": ["rug", "ruggedness"],
      "adj": ["rugged"]
    }
  },
  "w_b1_66": {
    "synonyms": ["terrace", "veranda", "porch"],
    "wordFamily": {
      "noun": ["balcony"]
    }
  },
  "w_b1_67": {
    "synonyms": ["barrier", "railing", "wall", "palisade"],
    "wordFamily": {
      "noun": ["fence", "fencing"],
      "verb": ["fence"]
    }
  },
  "w_b1_68": {
    "synonyms": ["entrance", "exit", "portal", "barrier"],
    "wordFamily": {
      "noun": ["gate", "gateway", "gatekeeper"]
    }
  },
  "w_b1_69": {
    "synonyms": ["way", "track", "trail", "route", "footpath"],
    "wordFamily": {
      "noun": ["path", "pathway", "pathfinder"]
    }
  },
  "w_b1_70": {
    "synonyms": ["approach", "access road"],
    "wordFamily": {
      "noun": ["driveway"]
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
console.log('Enriched Batch 7 of Band 1 vocabulary successfully.');
