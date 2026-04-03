import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_61": {
    "synonyms": ["goal", "target", "objective", "endpoint", "stop"],
    "wordFamily": {
      "noun": ["destination", "destiny"],
      "verb": ["destine"],
      "adj": ["destined"]
    }
  },
  "w_b2_62": {
    "synonyms": ["money", "cash", "tender", "coinage", "legal tender"],
    "wordFamily": {
      "noun": ["currency", "current"],
      "adj": ["current"],
      "adv": ["currently"]
    }
  },
  "w_b2_63": {
    "synonyms": ["swap", "trade", "interchange", "barter", "switch"],
    "wordFamily": {
      "noun": ["exchange", "exchanger"],
      "verb": ["exchange"],
      "adj": ["exchangeable"]
    }
  },
  "w_b2_64": {
    "synonyms": ["duties", "tariffs", "taxes", "checkpoint", "frontier"],
    "wordFamily": {
      "noun": ["customs", "custom", "customer"],
      "verb": ["accustom"],
      "adj": ["customary", "custom"]
    }
  },
  "w_b2_65": {
    "synonyms": ["boundary", "frontier", "edge", "margin", "perimeter"],
    "wordFamily": {
      "noun": ["border", "borderline"],
      "verb": ["border"],
      "adj": ["borderless"]
    }
  },
  "w_b2_66": {
    "synonyms": ["traveler", "commuter", "rider", "occupant", "fare"],
    "wordFamily": {
      "noun": ["passenger", "passage"],
      "verb": ["pass"]
    }
  },
  "w_b2_67": {
    "synonyms": ["luggage", "trunks", "bags", "suitcases", "gear"],
    "wordFamily": {
      "noun": ["baggage", "bag"],
      "verb": ["bag"]
    }
  },
  "w_b2_68": {
    "synonyms": ["permit", "endorsement", "clearance", "authorization"],
    "wordFamily": {
      "noun": ["visa"]
    }
  },
  "w_b2_69": {
    "synonyms": ["price", "cost", "charge", "fee", "toll"],
    "wordFamily": {
      "noun": ["fare"],
      "verb": ["fare"]
    }
  },
  "w_b2_70": {
    "synonyms": ["journey", "excursion", "outing", "jaunt", "tour"],
    "wordFamily": {
      "noun": ["trip", "tripper"],
      "verb": ["trip"]
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
console.log('Enriched Batch 7 of Band 2 vocabulary successfully.');
