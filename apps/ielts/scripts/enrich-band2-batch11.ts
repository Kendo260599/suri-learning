import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_101": {
    "synonyms": ["wharf", "pier", "jetty", "quay", "berth"],
    "wordFamily": {
      "noun": ["dock", "docker", "dockyard"],
      "verb": ["dock"]
    }
  },
  "w_b2_102": {
    "synonyms": ["pier", "quay", "wharf", "dock", "breakwater"],
    "wordFamily": {
      "noun": ["jetty"]
    }
  },
  "w_b2_103": {
    "synonyms": ["harbor", "dock", "haven", "port"],
    "wordFamily": {
      "noun": ["marina", "marine", "mariner"],
      "adj": ["marine"]
    }
  },
  "w_b2_104": {
    "synonyms": ["quay", "pier", "jetty", "dock", "berth"],
    "wordFamily": {
      "noun": ["wharf", "wharfage"]
    }
  },
  "w_b2_105": {
    "synonyms": ["beacon", "pharos", "watchtower"],
    "wordFamily": {
      "noun": ["lighthouse", "light", "house"],
      "verb": ["light", "house"]
    }
  },
  "w_b2_106": {
    "synonyms": ["float", "marker", "beacon"],
    "wordFamily": {
      "noun": ["buoy", "buoyancy"],
      "verb": ["buoy"],
      "adj": ["buoyant"]
    }
  },
  "w_b2_107": {
    "synonyms": ["stay", "support", "mainstay", "mooring"],
    "wordFamily": {
      "noun": ["anchor", "anchorage"],
      "verb": ["anchor"]
    }
  },
  "w_b2_108": {
    "synonyms": ["floor", "platform", "tier", "level"],
    "wordFamily": {
      "noun": ["deck", "decking"],
      "verb": ["deck"]
    }
  },
  "w_b2_109": {
    "synonyms": ["room", "compartment", "chamber", "cottage", "hut"],
    "wordFamily": {
      "noun": ["cabin"]
    }
  },
  "w_b2_110": {
    "synonyms": ["post", "pole", "spar", "upright"],
    "wordFamily": {
      "noun": ["mast", "masthead"]
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
console.log('Enriched Batch 11 of Band 2 vocabulary successfully.');
