import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_101": {
    "synonyms": ["billfold", "pocketbook", "purse"],
    "wordFamily": {
      "noun": ["wallet"]
    }
  },
  "w_b1_102": {
    "synonyms": ["handbag", "pouch", "wallet"],
    "wordFamily": {
      "noun": ["purse"],
      "verb": ["purse"]
    }
  },
  "w_b1_103": {
    "synonyms": ["parasol", "sunshade", "brolly"],
    "wordFamily": {
      "noun": ["umbrella"]
    }
  },
  "w_b1_104": {
    "synonyms": ["timepiece", "chronometer", "observe", "view"],
    "wordFamily": {
      "noun": ["watch", "watchman", "watchword"],
      "verb": ["watch"],
      "adj": ["watchful"]
    }
  },
  "w_b1_105": {
    "synonyms": ["timepiece", "chronometer", "timer"],
    "wordFamily": {
      "noun": ["clock", "clockwork"],
      "verb": ["clock"]
    }
  },
  "w_b1_106": {
    "synonyms": ["opener", "latchkey", "clue", "solution"],
    "wordFamily": {
      "noun": ["key", "keyboard", "keyhole"],
      "verb": ["key"],
      "adj": ["key"]
    }
  },
  "w_b1_107": {
    "synonyms": ["fastener", "bolt", "latch", "sluice"],
    "wordFamily": {
      "noun": ["lock", "locker", "locksmith"],
      "verb": ["lock"]
    }
  },
  "w_b1_108": {
    "synonyms": ["links", "series", "sequence", "shackle"],
    "wordFamily": {
      "noun": ["chain", "chainsaw"],
      "verb": ["chain"]
    }
  },
  "w_b1_109": {
    "synonyms": ["band", "circle", "hoop", "arena"],
    "wordFamily": {
      "noun": ["ring", "ringleader", "ringlet"],
      "verb": ["ring"]
    }
  },
  "w_b1_110": {
    "synonyms": ["choker", "pendant", "strand"],
    "wordFamily": {
      "noun": ["necklace", "neck"]
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
console.log('Enriched Batch 11 of Band 1 vocabulary successfully.');
