import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enrichments: Record<string, any> = {
  "w_b2_31": {
    "synonyms": ["feeling", "sentiment", "passion", "reaction", "mood"],
    "wordFamily": {
      "noun": ["emotion", "emotionalism"],
      "adj": ["emotional", "emotionless"],
      "adv": ["emotionally"]
    }
  },
  "w_b2_32": {
    "synonyms": ["fearful", "scared", "frightened", "terrified", "anxious"],
    "antonyms": ["brave", "confident", "fearless"]
  },
  "w_b2_33": {
    "synonyms": ["enthusiastic", "eager", "thrilled", "animated", "exhilarated"],
    "antonyms": ["bored", "calm", "indifferent"],
    "wordFamily": {
      "noun": ["excitement"],
      "verb": ["excite"],
      "adj": ["exciting", "excitable"],
      "adv": ["excitedly", "excitingly"]
    }
  },
  "w_b2_34": {
    "synonyms": ["amazed", "astonished", "startled", "stunned", "shocked"],
    "wordFamily": {
      "noun": ["surprise"],
      "verb": ["surprise"],
      "adj": ["surprising"],
      "adv": ["surprisedly", "surprisingly"]
    }
  },
  "w_b2_35": {
    "synonyms": ["anxious", "concerned", "troubled", "uneasy", "apprehensive"],
    "antonyms": ["calm", "confident", "unconcerned"],
    "wordFamily": {
      "noun": ["worry", "worrier"],
      "verb": ["worry"],
      "adj": ["worrying", "worrisome"],
      "adv": ["worriedly"]
    }
  },
  "w_b2_36": {
    "synonyms": ["weary", "uninterested", "jaded", "restless"],
    "antonyms": ["interested", "excited", "fascinated"],
    "wordFamily": {
      "noun": ["boredom", "bore"],
      "verb": ["bore"],
      "adj": ["boring"],
      "adv": ["boringly"]
    }
  },
  "w_b2_37": {
    "synonyms": ["solitary", "isolated", "companionless", "forlorn", "desolate"],
    "antonyms": ["popular", "accompanied"],
    "wordFamily": {
      "noun": ["loneliness"],
      "adj": ["lonesome"]
    }
  },
  "w_b2_38": {
    "synonyms": ["pleased", "satisfied", "honored", "arrogant", "haughty"],
    "antonyms": ["ashamed", "humble", "modest"],
    "wordFamily": {
      "noun": ["pride"],
      "adv": ["proudly"]
    }
  },
  "w_b2_39": {
    "synonyms": ["timid", "reserved", "bashful", "modest", "diffident"],
    "antonyms": ["confident", "outgoing", "bold"],
    "wordFamily": {
      "noun": ["shyness"],
      "adv": ["shyly"]
    }
  },
  "w_b2_40": {
    "synonyms": ["self-assured", "certain", "positive", "sure", "bold"],
    "antonyms": ["shy", "uncertain", "diffident"],
    "wordFamily": {
      "noun": ["confidence", "confidant"],
      "verb": ["confide"],
      "adj": ["confidential"],
      "adv": ["confidently", "confidentially"]
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
console.log('Enriched Batch 4 of Band 2 vocabulary successfully.');
