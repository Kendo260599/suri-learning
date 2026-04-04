import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_81": {
    "synonyms": ["traveler", "passenger", "worker", "shuttler"],
    "wordFamily": {
      "noun": ["commuter", "commute", "commutation"],
      "verb": ["commute"],
      "adj": ["commutable"]
    }
  },
  "w_b2_82": {
    "synonyms": ["bottleneck", "blockage", "jam", "overcrowding", "clogging"],
    "wordFamily": {
      "noun": ["congestion"],
      "verb": ["congest"],
      "adj": ["congested"]
    }
  },
  "w_b2_83": {
    "synonyms": ["deadlock", "stalemate", "logjam", "bottleneck", "standstill"],
    "wordFamily": {
      "noun": ["gridlock"],
      "verb": ["gridlock"]
    }
  },
  "w_b2_84": {
    "synonyms": ["walker", "stroller", "foot traveler"],
    "wordFamily": {
      "noun": ["pedestrian", "pedestrianization"],
      "verb": ["pedestrianize"],
      "adj": ["pedestrian"]
    }
  },
  "w_b2_85": {
    "synonyms": ["sidewalk", "footpath", "walkway", "flagging"],
    "wordFamily": {
      "noun": ["pavement", "paving"],
      "verb": ["pave"]
    }
  },
  "w_b2_86": {
    "synonyms": ["pavement", "footpath", "walkway", "path"],
    "wordFamily": {
      "noun": ["sidewalk", "side", "walk"],
      "verb": ["walk"]
    }
  },
  "w_b2_87": {
    "synonyms": ["junction", "crossroads", "interchange", "confluence"],
    "wordFamily": {
      "noun": ["intersection", "intersect"],
      "verb": ["intersect"],
      "adj": ["intersecting"]
    }
  },
  "w_b2_88": {
    "synonyms": ["intersection", "junction", "turning point", "crisis"],
    "wordFamily": {
      "noun": ["crossroads", "cross", "road"],
      "verb": ["cross"]
    }
  },
  "w_b2_89": {
    "synonyms": ["traffic circle", "rotary", "circus"],
    "wordFamily": {
      "noun": ["roundabout"],
      "adj": ["roundabout"]
    }
  },
  "w_b2_90": {
    "synonyms": ["overpass", "bridge", "viaduct"],
    "wordFamily": {
      "noun": ["flyover", "fly", "over"],
      "verb": ["fly"]
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
console.log('Enriched Batch 9 of Band 2 vocabulary successfully.');
