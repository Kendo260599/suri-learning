import * as fs from 'fs';
import * as path from 'path';

const VOCAB_PATH = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichment: Record<string, any> = {
  "w_b1_1": {
    "synonyms": ["surroundings", "habitat", "ecosystem"],
    "antonyms": ["vacuum", "void"],
    "wordFamily": {
      "noun": ["environment", "environmentalist"],
      "adj": ["environmental"],
      "adv": ["environmentally"]
    }
  },
  "w_b1_2": {
    "synonyms": ["advantage", "profit", "gain"],
    "antonyms": ["disadvantage", "drawback", "loss"],
    "wordFamily": {
      "noun": ["benefit", "beneficiary"],
      "verb": ["benefit"],
      "adj": ["beneficial"],
      "adv": ["beneficially"]
    }
  },
  "w_b1_3": {
    "synonyms": ["difficulty", "problem", "obstacle"],
    "antonyms": ["ease", "solution", "facility"],
    "wordFamily": {
      "noun": ["challenge", "challenger"],
      "verb": ["challenge"],
      "adj": ["challenging"]
    }
  },
  "w_b1_4": {
    "synonyms": ["enhance", "better", "upgrade"],
    "antonyms": ["worsen", "deteriorate", "decline"],
    "wordFamily": {
      "noun": ["improvement"],
      "verb": ["improve"],
      "adj": ["improved", "improvable"]
    }
  },
  "w_b1_5": {
    "synonyms": ["concentrate", "center", "fixate"],
    "antonyms": ["distract", "scatter", "ignore"],
    "wordFamily": {
      "noun": ["focus"],
      "verb": ["focus"],
      "adj": ["focused"]
    }
  },
  "w_b1_6": {
    "synonyms": ["dawn", "daybreak", "sunrise"],
    "antonyms": ["evening", "night", "sunset"]
  },
  "w_b1_7": {
    "synonyms": ["dusk", "twilight", "sunset"],
    "antonyms": ["morning", "dawn", "sunrise"]
  },
  "w_b1_8": {
    "synonyms": ["post-noon"],
    "antonyms": ["forenoon", "morning"]
  },
  "w_b1_9": {
    "synonyms": ["darkness", "nighttime"],
    "antonyms": ["day", "daytime", "light"]
  },
  "w_b1_10": {
    "synonyms": ["mom", "mummy", "mama"],
    "antonyms": ["father"],
    "wordFamily": {
      "noun": ["mother", "motherhood"],
      "verb": ["mother"],
      "adj": ["motherly"]
    }
  }
};

function enrichVocab() {
  let content = fs.readFileSync(VOCAB_PATH, 'utf8');
  
  for (const [id, data] of Object.entries(enrichment)) {
    // Find the object block for this ID
    const regex = new RegExp(`(\\{[^{}]*?"id":\\s*"${id}"[^{}]*?)(\\n\\s*\\})`, 'g');
    
    content = content.replace(regex, (match, p1, p2) => {
      let enriched = p1;
      for (const [key, value] of Object.entries(data)) {
        const jsonValue = JSON.stringify(value, null, 2).replace(/\n/g, '\n    ');
        enriched += `,\n    "${key}": ${jsonValue}`;
      }
      return enriched + p2;
    });
  }
  
  fs.writeFileSync(VOCAB_PATH, content);
  console.log('Enriched Band 1 vocabulary successfully.');
}

enrichVocab();
