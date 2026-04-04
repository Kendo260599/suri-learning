import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_11": {
    "synonyms": ["choice", "resolution", "conclusion", "determination", "judgment"],
    "wordFamily": {
      "noun": ["decision", "decisiveness"],
      "verb": ["decide"],
      "adj": ["decisive", "decided"],
      "adv": ["decisively"]
    }
  },
  "w_b2_12": {
    "synonyms": ["information", "understanding", "wisdom", "expertise", "awareness"],
    "wordFamily": {
      "noun": ["knowledge"],
      "verb": ["know"],
      "adj": ["knowledgeable", "known", "knowing"],
      "adv": ["knowingly"]
    }
  },
  "w_b2_13": {
    "synonyms": ["achievement", "victory", "triumph", "accomplishment", "prosperity"],
    "wordFamily": {
      "noun": ["success", "successor"],
      "verb": ["succeed"],
      "adj": ["successful", "successive"],
      "adv": ["successfully"]
    }
  },
  "w_b2_14": {
    "synonyms": ["defeat", "breakdown", "collapse", "fiasco", "shortcoming"],
    "wordFamily": {
      "noun": ["failure"],
      "verb": ["fail"],
      "adj": ["failing", "failed"]
    }
  },
  "w_b2_15": {
    "synonyms": ["capability", "capacity", "talent", "aptitude", "competence"],
    "wordFamily": {
      "noun": ["ability", "inability", "disability"],
      "verb": ["enable", "disable"],
      "adj": ["able", "unable", "disabled"]
    }
  },
  "w_b2_16": {
    "synonyms": ["expertise", "proficiency", "talent", "knack", "dexterity"],
    "wordFamily": {
      "noun": ["skill", "skilfulness"],
      "adj": ["skilful", "skilled"],
      "adv": ["skilfully"]
    }
  },
  "w_b2_17": {
    "synonyms": ["objective", "aim", "target", "ambition", "purpose"],
    "wordFamily": {
      "noun": ["goal", "goalkeeper"]
    }
  },
  "w_b2_18": {
    "synonyms": ["strategy", "scheme", "proposal", "arrangement", "design"],
    "wordFamily": {
      "noun": ["plan", "planner", "planning"],
      "verb": ["plan"],
      "adj": ["planned"]
    }
  },
  "w_b2_19": {
    "synonyms": ["issue", "difficulty", "trouble", "complication", "dilemma"],
    "wordFamily": {
      "noun": ["problem", "problematic"],
      "adj": ["problematic"],
      "adv": ["problematically"]
    }
  },
  "w_b2_20": {
    "synonyms": ["answer", "resolution", "remedy", "explanation", "key"],
    "wordFamily": {
      "noun": ["solution", "solubility", "solvent"],
      "verb": ["solve"],
      "adj": ["solvable", "soluble"]
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
console.log('Enriched Batch 2 of Band 2 vocabulary successfully.');
