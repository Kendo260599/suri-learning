import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_151": {
    "synonyms": ["ear pain", "otalgia"],
    "wordFamily": {
      "noun": ["earache", "ear", "ache"]
    }
  },
  "w_b1_152": {
    "synonyms": ["throat pain", "pharyngitis"],
    "wordFamily": {
      "noun": ["sore throat", "sore", "throat"]
    }
  },
  "w_b1_153": {
    "synonyms": ["chill", "common cold", "low temperature"],
    "antonyms": ["hot", "warm"],
    "wordFamily": {
      "noun": ["cold", "coldness"],
      "adj": ["cold"],
      "adv": ["coldly"]
    }
  },
  "w_b1_154": {
    "synonyms": ["influenza", "grippe"],
    "wordFamily": {
      "noun": ["flu"]
    }
  },
  "w_b1_155": {
    "synonyms": ["germ", "microbe", "pathogen", "bug"],
    "wordFamily": {
      "noun": ["virus"],
      "adj": ["viral"]
    }
  },
  "w_b1_156": {
    "synonyms": ["microorganisms", "germs", "microbes"],
    "wordFamily": {
      "noun": ["bacteria", "bacterium"],
      "adj": ["bacterial"]
    }
  },
  "w_b1_157": {
    "synonyms": ["contamination", "contagion", "disease", "sepsis"],
    "wordFamily": {
      "noun": ["infection", "infectiousness"],
      "verb": ["infect"],
      "adj": ["infectious", "infected"]
    }
  },
  "w_b1_158": {
    "synonyms": ["swelling", "redness", "soreness"],
    "wordFamily": {
      "noun": ["inflammation", "inflame"],
      "verb": ["inflame"],
      "adj": ["inflammatory", "inflamed"]
    }
  },
  "w_b1_159": {
    "synonyms": ["distension", "enlargement", "bulge", "lump"],
    "wordFamily": {
      "noun": ["swelling", "swell"],
      "verb": ["swell"],
      "adj": ["swollen"]
    }
  },
  "w_b1_160": {
    "synonyms": ["contusion", "mark", "blemish"],
    "wordFamily": {
      "noun": ["bruise"],
      "verb": ["bruise"]
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
console.log('Enriched Batch 16 of Band 1 vocabulary successfully.');
