import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_91": {
    "synonyms": ["subway", "tunnel", "passageway", "conduit"],
    "wordFamily": {
      "noun": ["underpass", "under", "pass"],
      "verb": ["pass"]
    }
  },
  "w_b2_92": {
    "synonyms": ["underpass", "passageway", "subway", "shaft", "gallery"],
    "wordFamily": {
      "noun": ["tunnel", "tunnelling"],
      "verb": ["tunnel"]
    }
  },
  "w_b2_93": {
    "synonyms": ["viaduct", "span", "overpass", "link", "connection"],
    "wordFamily": {
      "noun": ["bridge", "bridging"],
      "verb": ["bridge"]
    }
  },
  "w_b2_94": {
    "synonyms": ["bridge", "overpass", "flyover", "aqueduct"],
    "wordFamily": {
      "noun": ["viaduct", "via", "duct"]
    }
  },
  "w_b2_95": {
    "synonyms": ["raised road", "embankment", "path", "track"],
    "wordFamily": {
      "noun": ["causeway", "cause", "way"]
    }
  },
  "w_b2_96": {
    "synonyms": ["bank", "mound", "dam", "dyke", "levee"],
    "wordFamily": {
      "noun": ["embankment", "bank"],
      "verb": ["embank", "bank"]
    }
  },
  "w_b2_97": {
    "synonyms": ["wharf", "pier", "jetty", "dock", "berth"],
    "wordFamily": {
      "noun": ["quay", "quayside"]
    }
  },
  "w_b2_98": {
    "synonyms": ["jetty", "quay", "wharf", "dock", "landing"],
    "wordFamily": {
      "noun": ["pier"]
    }
  },
  "w_b2_99": {
    "synonyms": ["port", "dock", "haven", "marina", "anchorage"],
    "wordFamily": {
      "noun": ["harbor", "harbourage"],
      "verb": ["harbor"]
    }
  },
  "w_b2_100": {
    "synonyms": ["harbor", "dock", "haven", "marina", "seaport"],
    "wordFamily": {
      "noun": ["port", "portal", "porterage"],
      "verb": ["port"]
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
console.log('Enriched Batch 10 of Band 2 vocabulary successfully.');
