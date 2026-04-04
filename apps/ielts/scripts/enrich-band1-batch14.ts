import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b1_131": {
    "synonyms": ["ophthalmologist", "eye doctor"],
    "wordFamily": {
      "noun": ["optician", "optics", "optical"],
      "adj": ["optical"]
    }
  },
  "w_b1_132": {
    "synonyms": ["medical center", "infirmary", "sanatorium"],
    "wordFamily": {
      "noun": ["hospital", "hospitality", "hospitalization"],
      "verb": ["hospitalize"],
      "adj": ["hospitable"]
    }
  },
  "w_b1_133": {
    "synonyms": ["medical center", "surgery", "dispensary"],
    "wordFamily": {
      "noun": ["clinic", "clinician"],
      "adj": ["clinical"]
    }
  },
  "w_b1_134": {
    "synonyms": ["operation", "procedure", "clinic"],
    "wordFamily": {
      "noun": ["surgery", "surgeon"],
      "adj": ["surgical"]
    }
  },
  "w_b1_135": {
    "synonyms": ["drugstore", "chemist", "dispensary"],
    "wordFamily": {
      "noun": ["pharmacy", "pharmacist", "pharmaceutical"],
      "adj": ["pharmaceutical"]
    }
  },
  "w_b1_136": {
    "synonyms": ["pharmacist", "druggist"],
    "wordFamily": {
      "noun": ["chemist", "chemistry", "chemical"],
      "adj": ["chemical"]
    }
  },
  "w_b1_137": {
    "synonyms": ["rescue vehicle"],
    "wordFamily": {
      "noun": ["ambulance"]
    }
  },
  "w_b1_138": {
    "synonyms": ["crisis", "urgency", "exigency"],
    "wordFamily": {
      "noun": ["emergency", "emergence"],
      "verb": ["emerge"],
      "adj": ["emergent"]
    }
  },
  "w_b1_139": {
    "synonyms": ["mishap", "misfortune", "chance", "coincidence"],
    "wordFamily": {
      "noun": ["accident"],
      "adj": ["accidental"],
      "adv": ["accidentally"]
    }
  },
  "w_b1_140": {
    "synonyms": ["harm", "damage", "wound", "lesion"],
    "wordFamily": {
      "noun": ["injury"],
      "verb": ["injure"],
      "adj": ["injured", "injurious"]
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
console.log('Enriched Batch 14 of Band 1 vocabulary successfully.');
