import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_51": {
    "synonyms": ["inn", "hostel", "motel", "lodging", "resort"],
    "wordFamily": {
      "noun": ["hotel", "hotelier"]
    }
  },
  "w_b2_52": {
    "synonyms": ["traveler", "visitor", "sightseer", "vacationer", "holidaymaker"],
    "wordFamily": {
      "noun": ["tourism", "tourist"],
      "verb": ["tour"],
      "adj": ["touristic"]
    }
  },
  "w_b2_53": {
    "synonyms": ["trip", "voyage", "expedition", "tour", "trek"],
    "wordFamily": {
      "noun": ["journey", "journeyman"],
      "verb": ["journey"]
    }
  },
  "w_b2_54": {
    "synonyms": ["chart", "plan", "atlas", "diagram", "plot"],
    "wordFamily": {
      "noun": ["map", "mapping", "mapper"],
      "verb": ["map"]
    }
  },
  "w_b2_55": {
    "synonyms": ["guide", "handbook", "manual", "directory"],
    "wordFamily": {
      "noun": ["guidebook", "guide"],
      "verb": ["guide"],
      "adj": ["guided"]
    }
  },
  "w_b2_56": {
    "synonyms": ["touring", "excursion", "visiting", "exploration"],
    "wordFamily": {
      "noun": ["sightseeing", "sightseer", "sight"],
      "verb": ["sightsee"]
    }
  },
  "w_b2_57": {
    "synonyms": ["keepsake", "memento", "token", "reminder", "relic"],
    "wordFamily": {
      "noun": ["souvenir"]
    }
  },
  "w_b2_58": {
    "synonyms": ["housing", "lodging", "shelter", "quarters", "residence"],
    "wordFamily": {
      "noun": ["accommodation", "accommodator"],
      "verb": ["accommodate"],
      "adj": ["accommodating"]
    }
  },
  "w_b2_59": {
    "synonyms": ["booking", "engagement", "appointment", "arrangement"],
    "wordFamily": {
      "noun": ["reservation", "reserve"],
      "verb": ["reserve"],
      "adj": ["reserved"]
    }
  },
  "w_b2_60": {
    "synonyms": ["schedule", "program", "route", "plan", "timetable"],
    "wordFamily": {
      "noun": ["itinerary", "itinerant"],
      "adj": ["itinerant"]
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
console.log('Enriched Batch 6 of Band 2 vocabulary successfully.');
