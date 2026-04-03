import * as fs from 'fs';
import * as path from 'path';

const VOCAB_PATH = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');

const mapping: Record<string, string> = {
  "w_b1_19": "1-8",
  "w_b1_20": "1-8",
  "w_b1_22": "1-7",
  "w_b1_23": "1-7",
  "w_b1_24": "1-5",
  "w_b1_25": "1-5",
  "w_b1_26": "1-5",
  "w_b1_27": "1-5",
  "w_b1_30": "1-7",
  "w_b1_31": "1-7",
  "w_b1_32": "1-7",
  "w_b1_33": "1-7",
  "w_b1_34": "1-6",
  "w_b1_35": "1-6",
  "w_b1_36": "1-6",
  "w_b1_37": "1-6",
  "w_b1_38": "1-6",
  "w_b1_39": "1-6",
  "w_b1_40": "1-6",
  "w_b1_41": "1-6",
  "w_b1_42": "1-6",
  "w_b1_43": "1-6",
  "w_b1_44": "1-6",
  "w_b1_45": "1-6",
  "w_b1_46": "1-6",
  "w_b1_47": "1-6"
};

function updateVocab() {
  let content = fs.readFileSync(VOCAB_PATH, 'utf8');
  
  for (const [id, topicId] of Object.entries(mapping)) {
    // Find the object with this ID and update its topicId
    // We use a regex that captures the whole object block to be safe
    const regex = new RegExp(`("id":\\s*"${id}",[\\s\\S]*?"topicId":\\s*")1-1"`, 'g');
    content = content.replace(regex, `$1${topicId}"`);
  }
  
  fs.writeFileSync(VOCAB_PATH, content);
  console.log('Updated Band 1 topics successfully.');
}

updateVocab();
