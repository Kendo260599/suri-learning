import * as fs from 'fs';
import * as path from 'path';

const VOCAB_PATH = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichmentData: Record<string, any> = {
  "w_b1_11": {
    "synonyms": ["dad", "daddy", "papa"],
    "antonyms": ["mother"],
    "wordFamily": {
      "noun": ["father", "fatherhood"],
      "verb": ["father"],
      "adj": ["fatherly"]
    }
  },
  "w_b1_12": {
    "synonyms": ["sibling", "bro"],
    "antonyms": ["sister"],
    "wordFamily": {
      "noun": ["brother", "brotherhood"],
      "adj": ["brotherly"]
    }
  },
  "w_b1_13": {
    "synonyms": ["sibling", "sis"],
    "antonyms": ["brother"],
    "wordFamily": {
      "noun": ["sister", "sisterhood"],
      "adj": ["sisterly"]
    }
  },
  "w_b1_14": {
    "synonyms": ["pome"],
    "wordFamily": {
      "noun": ["apple", "applesauce"]
    }
  },
  "w_b1_15": {
    "synonyms": ["loaf", "bun"],
    "wordFamily": {
      "noun": ["bread", "breadwinner"],
      "adj": ["breaded"]
    }
  },
  "w_b1_16": {
    "synonyms": ["dairy"],
    "wordFamily": {
      "noun": ["milk", "milkshake"],
      "verb": ["milk"],
      "adj": ["milky"]
    }
  },
  "w_b1_17": {
    "synonyms": ["grain"],
    "wordFamily": {
      "noun": ["rice", "riceworks"]
    }
  },
  "w_b1_18": {
    "synonyms": ["fruit"],
    "wordFamily": {
      "noun": ["banana", "bananarama"]
    }
  },
  "w_b1_19": {
    "synonyms": ["pupil", "learner", "scholar"],
    "antonyms": ["teacher", "instructor"],
    "wordFamily": {
      "noun": ["student", "studentship"],
      "adj": ["studious"]
    }
  },
  "w_b1_20": {
    "synonyms": ["instructor", "educator", "tutor"],
    "antonyms": ["student", "pupil"],
    "wordFamily": {
      "noun": ["teacher", "teaching"],
      "verb": ["teach"]
    }
  }
};

function enrichVocab() {
  let content = fs.readFileSync(VOCAB_PATH, 'utf-8');
  
  for (const [id, data] of Object.entries(enrichmentData)) {
    const regex = new RegExp(`("id":\\s*"${id}",[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
    const match = content.match(regex);
    
    if (match) {
      const original = match[0];
      let enriched = original;
      
      if (data.synonyms) {
        enriched += `,\n    "synonyms": ${JSON.stringify(data.synonyms, null, 2).replace(/\n/g, '\n    ')}`;
      }
      if (data.antonyms) {
        enriched += `,\n    "antonyms": ${JSON.stringify(data.antonyms, null, 2).replace(/\n/g, '\n    ')}`;
      }
      if (data.wordFamily) {
        enriched += `,\n    "wordFamily": ${JSON.stringify(data.wordFamily, null, 2).replace(/\n/g, '\n    ')}`;
      }
      
      content = content.replace(original, enriched);
    }
  }
  
  fs.writeFileSync(VOCAB_PATH, content);
  console.log('Successfully enriched Band 1 words (batch 2).');
}

enrichVocab();
