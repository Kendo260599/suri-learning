import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_1": {
    "synonyms": ["critical", "essential", "vital", "pivotal", "decisive"],
    "wordFamily": {
      "noun": ["cruciality"],
      "adv": ["crucially"]
    }
  },
  "w_b2_2": {
    "synonyms": ["vary", "waver", "oscillate", "alternate", "shift"],
    "wordFamily": {
      "noun": ["fluctuation"],
      "verb": ["fluctuate"],
      "adj": ["fluctuating"]
    }
  },
  "w_b2_3": {
    "synonyms": ["alleviate", "reduce", "diminish", "lessen", "weaken"],
    "wordFamily": {
      "noun": ["mitigation", "mitigator"],
      "verb": ["mitigate"],
      "adj": ["mitigating", "mitigative"]
    }
  },
  "w_b2_4": {
    "synonyms": ["intense", "deep", "extreme", "serious", "thorough"],
    "wordFamily": {
      "noun": ["profundity", "profoundness"],
      "adv": ["profoundly"]
    }
  },
  "w_b2_5": {
    "synonyms": ["lodge", "house", "contain", "hold", "adjust"],
    "wordFamily": {
      "noun": ["accommodation", "accommodator"],
      "verb": ["accommodate"],
      "adj": ["accommodating"]
    }
  },
  "w_b2_6": {
    "synonyms": ["habit", "custom", "procedure", "practice", "schedule"],
    "wordFamily": {
      "noun": ["routine"],
      "adv": ["routinely"]
    }
  },
  "w_b2_7": {
    "synonyms": ["pastime", "leisure activity", "interest", "pursuit"],
    "wordFamily": {
      "noun": ["hobby", "hobbyist"]
    }
  },
  "w_b2_8": {
    "synonyms": ["journey", "trip", "voyage", "tour", "trek"],
    "wordFamily": {
      "noun": ["travel", "traveller", "travels"],
      "verb": ["travel"],
      "adj": ["travelling"]
    }
  },
  "w_b2_9": {
    "synonyms": ["knowledge", "skill", "practice", "background", "event"],
    "wordFamily": {
      "noun": ["experience"],
      "verb": ["experience"],
      "adj": ["experienced", "experiential"]
    }
  },
  "w_b2_10": {
    "synonyms": ["chance", "opening", "possibility", "prospect", "occasion"],
    "wordFamily": {
      "noun": ["opportunity", "opportunism", "opportunist"],
      "adj": ["opportune", "opportunistic"],
      "adv": ["opportunely"]
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
console.log('Enriched Batch 1 of Band 2 vocabulary successfully.');
