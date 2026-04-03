import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_41": {
    "synonyms": ["anxious", "apprehensive", "edgy", "tense", "uneasy"],
    "antonyms": ["calm", "confident", "relaxed"],
    "wordFamily": {
      "noun": ["nervousness", "nerve"],
      "adj": ["nervy"],
      "adv": ["nervously"]
    }
  },
  "w_b2_42": {
    "synonyms": ["serene", "tranquil", "peaceful", "composed", "placid"],
    "antonyms": ["excited", "nervous", "stormy"],
    "wordFamily": {
      "noun": ["calmness", "calm"],
      "verb": ["calm"],
      "adv": ["calmly"]
    }
  },
  "w_b2_43": {
    "synonyms": ["at ease", "carefree", "laid-back", "unwinded", "mellow"],
    "antonyms": ["stressed", "tense", "anxious"],
    "wordFamily": {
      "noun": ["relaxation"],
      "verb": ["relax"],
      "adj": ["relaxing"]
    }
  },
  "w_b2_44": {
    "synonyms": ["strained", "pressured", "overworked", "burdened", "harried"],
    "antonyms": ["relaxed", "calm"],
    "wordFamily": {
      "noun": ["stress", "stressor"],
      "verb": ["stress"],
      "adj": ["stressful"]
    }
  },
  "w_b2_45": {
    "synonyms": ["culpable", "remorseful", "ashamed", "contrite", "responsible"],
    "antonyms": ["innocent", "blameless"],
    "wordFamily": {
      "noun": ["guilt", "guiltiness"],
      "adv": ["guiltily"]
    }
  },
  "w_b2_46": {
    "synonyms": ["airfield", "airstrip", "heliport", "terminal"],
    "wordFamily": {
      "noun": ["airport", "airplane", "aircraft"]
    }
  },
  "w_b2_47": {
    "synonyms": ["terminal", "stop", "depot", "base", "post"],
    "wordFamily": {
      "noun": ["station", "stationery"],
      "verb": ["station"],
      "adj": ["stationary"]
    }
  },
  "w_b2_48": {
    "synonyms": ["pass", "voucher", "coupon", "token", "label"],
    "wordFamily": {
      "noun": ["ticket", "ticketing"],
      "verb": ["ticket"]
    }
  },
  "w_b2_49": {
    "synonyms": ["trip", "voyage", "expedition", "tour", "trek"],
    "wordFamily": {
      "noun": ["journey", "journeyman"],
      "verb": ["journey"]
    }
  },
  "w_b2_50": {
    "synonyms": ["traveler", "commuter", "rider", "voyager"],
    "wordFamily": {
      "noun": ["passenger", "passage", "passerby"]
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
console.log('Enriched Batch 5 of Band 2 vocabulary successfully.');
