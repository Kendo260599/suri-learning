import { CAMBRIDGE_ROADMAP } from '../src/data/roadmap_vocab';

const next100 = CAMBRIDGE_ROADMAP.slice(100, 200);
const missing = next100.filter(w => 
  !w.antonyms || w.antonyms.length === 0 || 
  !w.usageNotes || w.usageNotes.trim() === "" || 
  !w.register || w.register.trim() === ""
);

if (missing.length > 0) {
  console.log(`Found ${missing.length} words with missing data in the next 100 (101-200):`);
  missing.forEach(w => console.log(`- ${w.word} (${w.id})`));
} else {
  console.log("All words in the next 100 (101-200) are fully enriched!");
}
