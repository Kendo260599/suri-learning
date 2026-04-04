import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_71": {
    "synonyms": ["journey", "trip", "excursion", "expedition", "voyage"],
    "wordFamily": {
      "noun": ["tour", "tourism", "tourist"],
      "verb": ["tour"],
      "adj": ["touristic"]
    }
  },
  "w_b2_72": {
    "synonyms": ["voyage", "sail", "boat trip", "crossing"],
    "wordFamily": {
      "noun": ["cruise", "cruiser"],
      "verb": ["cruise"]
    }
  },
  "w_b2_73": {
    "synonyms": ["journey", "voyage", "exploration", "mission", "safari"],
    "wordFamily": {
      "noun": ["expedition", "expeditioner"],
      "verb": ["expedite"],
      "adj": ["expeditious"]
    }
  },
  "w_b2_74": {
    "synonyms": ["journey", "cruise", "travels", "passage", "crossing"],
    "wordFamily": {
      "noun": ["voyage", "voyager"],
      "verb": ["voyage"]
    }
  },
  "w_b2_75": {
    "synonyms": ["trip", "outing", "jaunt", "expedition", "tour"],
    "wordFamily": {
      "noun": ["excursion", "excursionist"]
    }
  },
  "w_b2_76": {
    "synonyms": ["ticket", "pass", "permit", "voucher"],
    "wordFamily": {
      "noun": ["boarding", "board", "pass"],
      "verb": ["board", "pass"]
    }
  },
  "w_b2_77": {
    "synonyms": ["registration", "enrollment", "arrival", "entry"],
    "wordFamily": {
      "noun": ["check-in", "check"],
      "verb": ["check in", "check"]
    }
  },
  "w_b2_78": {
    "synonyms": ["station", "depot", "end", "limit", "boundary"],
    "wordFamily": {
      "noun": ["terminal", "termination", "terminus"],
      "verb": ["terminate"],
      "adj": ["terminal"],
      "adv": ["terminally"]
    }
  },
  "w_b2_79": {
    "synonyms": ["airstrip", "landing strip", "track", "path"],
    "wordFamily": {
      "noun": ["runway", "run"],
      "verb": ["run"]
    }
  },
  "w_b2_80": {
    "synonyms": ["travel", "journey", "shuttle", "commutation"],
    "wordFamily": {
      "noun": ["commute", "commuter", "commutation"],
      "verb": ["commute"],
      "adj": ["commutable"]
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
console.log('Enriched Batch 8 of Band 2 vocabulary successfully.');
