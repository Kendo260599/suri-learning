import { CAMBRIDGE_ROADMAP } from '../src/data/roadmap_vocab';

const first100 = CAMBRIDGE_ROADMAP.slice(0, 100);
const missing = first100.filter(w => 
  !w.antonyms || w.antonyms.length === 0 || 
  !w.usageNotes || w.usageNotes === "" || 
  !w.register
);

if (missing.length > 0) {
  console.log(`Found ${missing.length} words with missing data in the first 100:`);
  missing.forEach(w => console.log(`- ${w.word} (${w.id})`));
} else {
  console.log("All first 100 words are fully enriched!");
}
