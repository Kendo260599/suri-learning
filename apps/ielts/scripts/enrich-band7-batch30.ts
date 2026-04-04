import fs from 'fs';
import path from 'path';

const vocabPath = path.join(process.cwd(), 'src/data/roadmap_vocab.ts');
let content = fs.readFileSync(vocabPath, 'utf8');

const enrichments: Record<string, { synonyms: string[], wordFamily: any }> = {
  "w_b7_291": {
    "synonyms": ["gather", "assemble", "meet", "summon"],
    "wordFamily": { "noun": ["convention"], "verb": ["convene"] }
  },
  "w_b7_292": {
    "synonyms": ["ease", "comfort", "usefulness", "accessibility"],
    "wordFamily": { "noun": ["convenience"], "adj": ["convenient"], "adv": ["conveniently"] }
  },
  "w_b7_293": {
    "synonyms": ["handy", "accessible", "suitable", "practical"],
    "wordFamily": { "noun": ["convenience"], "adj": ["convenient"], "adv": ["conveniently"] }
  },
  "w_b7_294": {
    "synonyms": ["meeting", "conference", "custom", "tradition"],
    "wordFamily": { "noun": ["convention"], "verb": ["convene"], "adj": ["conventional"] }
  },
  "w_b7_295": {
    "synonyms": ["traditional", "standard", "ordinary", "normal"],
    "wordFamily": { "noun": ["convention"], "adj": ["conventional"], "adv": ["conventionally"] }
  },
  "w_b7_296": {
    "synonyms": ["meet", "join", "unite", "come together"],
    "wordFamily": { "noun": ["convergence"], "verb": ["converge"], "adj": ["convergent"] }
  },
  "w_b7_297": {
    "synonyms": ["talk", "chat", "speak", "communicate"],
    "wordFamily": { "noun": ["conversation"], "verb": ["converse"], "adj": ["conversational"] }
  },
  "w_b7_298": {
    "synonyms": ["on the other hand", "in contrast", "oppositely", "vice versa"],
    "wordFamily": { "noun": ["converse"], "adj": ["converse"], "adv": ["conversely"] }
  },
  "w_b7_299": {
    "synonyms": ["change", "transformation", "adaptation", "alteration"],
    "wordFamily": { "noun": ["conversion", "convert"], "verb": ["convert"], "adj": ["convertible"] }
  },
  "w_b7_300": {
    "synonyms": ["change", "transform", "adapt", "alter"],
    "wordFamily": { "noun": ["conversion", "convert"], "verb": ["convert"], "adj": ["convertible"] }
  }
};

for (const [id, data] of Object.entries(enrichments)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"topicId":\\s*"[^"]*")`, 'g');
  const replacement = `$1,\n    "synonyms": ${JSON.stringify(data.synonyms)},\n    "wordFamily": ${JSON.stringify(data.wordFamily)}`;
  
  if (content.includes(`"id": "${id}"`) && !content.includes(`"id": "${id}"` + '[\\s\\S]*?"synonyms":')) {
      content = content.replace(regex, replacement);
  }
}

fs.writeFileSync(vocabPath, content);
console.log('Enriched w_b7_291 to w_b7_300');
