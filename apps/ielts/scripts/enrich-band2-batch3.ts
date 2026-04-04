import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_21": {
    "synonyms": ["communication", "note", "memo", "dispatch", "bulletin"],
    "wordFamily": {
      "noun": ["message", "messenger", "messaging"],
      "verb": ["message"]
    }
  },
  "w_b2_22": {
    "synonyms": ["dialogue", "chat", "discussion", "talk", "exchange"],
    "wordFamily": {
      "noun": ["conversation", "conversationalist"],
      "verb": ["converse"],
      "adj": ["conversational"],
      "adv": ["conversationally"]
    }
  },
  "w_b2_23": {
    "synonyms": ["view", "belief", "judgment", "sentiment", "perspective"],
    "wordFamily": {
      "noun": ["opinion", "opinionated"],
      "verb": ["opine"]
    }
  },
  "w_b2_24": {
    "synonyms": ["proposal", "recommendation", "advice", "hint", "clue"],
    "wordFamily": {
      "noun": ["suggestion", "suggestibility"],
      "verb": ["suggest"],
      "adj": ["suggestive", "suggestible"],
      "adv": ["suggestively"]
    }
  },
  "w_b2_25": {
    "synonyms": ["guidance", "counsel", "recommendation", "instruction", "tip"],
    "wordFamily": {
      "noun": ["advice", "adviser", "advisory"],
      "verb": ["advise"],
      "adj": ["advisable", "advised", "advisory"],
      "adv": ["advisably"]
    }
  },
  "w_b2_26": {
    "synonyms": ["accord", "contract", "settlement", "pact", "concord"],
    "wordFamily": {
      "noun": ["agreement", "agreeableness"],
      "verb": ["agree"],
      "adj": ["agreeable", "agreed"],
      "adv": ["agreeably"]
    }
  },
  "w_b2_27": {
    "synonyms": ["debate", "consultation", "deliberation", "dialogue", "talk"],
    "wordFamily": {
      "noun": ["discussion"],
      "verb": ["discuss"]
    }
  },
  "w_b2_28": {
    "synonyms": ["clarification", "description", "justification", "exposition", "account"],
    "wordFamily": {
      "noun": ["explanation", "explanative"],
      "verb": ["explain"],
      "adj": ["explanatory", "explainable"]
    }
  },
  "w_b2_29": {
    "synonyms": ["data", "facts", "intelligence", "news", "knowledge"],
    "wordFamily": {
      "noun": ["information", "informant", "informer"],
      "verb": ["inform"],
      "adj": ["informative", "informed", "informational"],
      "adv": ["informatively"]
    }
  },
  "w_b2_30": {
    "synonyms": ["emotion", "sensation", "sentiment", "impression", "intuition"],
    "wordFamily": {
      "noun": ["feeling", "feel"],
      "verb": ["feel"],
      "adj": ["feeling"],
      "adv": ["feelingly"]
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
console.log('Enriched Batch 3 of Band 2 vocabulary successfully.');
