import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const fixes: Record<string, any> = {
  "w_b7_68": { // Epicureanism
    "antonyms": ["Stoicism", "asceticism", "self-denial"],
    "usageNotes": "Often confused with simple hedonism, it actually emphasizes mental pleasure and freedom from fear.",
    "register": "Academic"
  },
  "w_b3_76": { // Pharmacy
    "antonyms": [],
    "usageNotes": "Commonly used to refer to both the science and the physical shop where medicines are sold.",
    "register": "Neutral"
  },
  "w_b4_71": { // Accumulate
    "antonyms": ["dissipate", "disperse", "scatter", "spend"],
    "usageNotes": "Often used with abstract concepts like wealth, evidence, or debt.",
    "register": "Neutral"
  },
  "w_b7_96": { // Initiate
    "antonyms": ["terminate", "conclude", "finish", "stop"],
    "usageNotes": "Can mean to start a process or to admit someone into a group with a ritual.",
    "register": "Formal"
  },
  "w_b7_106": { // Licence
    "antonyms": ["prohibition", "ban", "restriction"],
    "usageNotes": "This is the British English spelling for both the noun and the verb.",
    "register": "Neutral"
  },
  "w_b7_121": { // License
    "antonyms": ["prohibition", "ban", "restriction"],
    "usageNotes": "This is the American English spelling for both the noun and the verb.",
    "register": "Neutral"
  },
  "w_b3_79": { // Emergency
    "antonyms": ["normality", "routine", "safety"],
    "usageNotes": "Requires immediate action to prevent harm or damage.",
    "register": "Neutral"
  },
  "w_b1_138": { // Windstorm
    "synonyms": ["gale", "tempest", "squall", "blast"],
    "wordFamily": { "noun": ["windstorm", "wind"], "adj": ["windy"] },
    "antonyms": ["calm", "stillness", "breeze"],
    "usageNotes": "A storm characterized by high winds but often lacking significant precipitation.",
    "register": "Neutral"
  },
  "w_b7_214": { // Conform
    "antonyms": ["rebel", "differ", "deviate", "resist"],
    "usageNotes": "Usually followed by the preposition 'to' or 'with'.",
    "register": "Formal"
  },
  "w_b7_217": { // Confront
    "antonyms": ["avoid", "evade", "dodge", "shun"],
    "usageNotes": "Implies facing something difficult or hostile directly.",
    "register": "Neutral"
  },
  "w_b7_218": { // Confrontation
    "antonyms": ["agreement", "harmony", "peace", "concord"],
    "usageNotes": "Often describes a hostile or argumentative meeting.",
    "register": "Neutral"
  },
  "w_b2_32": { // Afraid
    "wordFamily": { "adj": ["afraid"] }
  },
  "w_b4_89": { // Hence
    "wordFamily": { "adv": ["hence"] }
  },
  "w_b5_128": { // Whereas
    "wordFamily": { "conj": ["whereas"] }
  },
  "w_b5_129": { // Whereby
    "wordFamily": { "conj": ["whereby"] }
  },
  "w_b7_328": { // Despite
    "wordFamily": { "prep": ["despite"] }
  },
  "w_b7_355": { // Furthermore
    "wordFamily": { "adv": ["furthermore"] }
  }
};

for (const [id, data] of Object.entries(fixes)) {
  // Find the object block for this ID
  const idIndex = content.indexOf(`"id": "${id}"`);
  if (idIndex === -1) continue;

  // Find the end of this object (the next "  },")
  const nextClosing = content.indexOf("  },", idIndex);
  const blockEnd = nextClosing !== -1 ? nextClosing : content.indexOf("  }", idIndex);
  
  let block = content.substring(idIndex, blockEnd);

  // Update or Add fields
  for (const [key, value] of Object.entries(data)) {
    const jsonValue = JSON.stringify(value, null, 2).replace(/\n/g, '\n    ');
    if (block.includes(`"${key}":`)) {
      // Replace existing
      const regex = new RegExp(`"${key}":\\s*[\\s\\S]*?(?=,\\n|\\n\\s*})`, 'g');
      block = block.replace(regex, `"${key}": ${jsonValue}`);
    } else {
      // Add new (before wordFamily)
      if (block.includes('"wordFamily":')) {
        block = block.replace('"wordFamily":', `"${key}": ${jsonValue},\n    "wordFamily":`);
      } else {
        block += `,\n    "${key}": ${jsonValue}`;
      }
    }
  }

  content = content.substring(0, idIndex) + block + content.substring(blockEnd);
}

fs.writeFileSync(vocabPath, content);
console.log('Fixed 11 missing/corrupted entries.');
