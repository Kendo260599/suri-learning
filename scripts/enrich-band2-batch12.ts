import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'src/data/roadmap_vocab.ts');

const enrichments = {
  "w_b2_111": {
    "synonyms": ["cruise", "voyage", "navigate", "drift"],
    "wordFamily": {
      "noun": ["sail", "sailor", "sailing"],
      "verb": ["sail"]
    }
  },
  "w_b2_112": {
    "synonyms": ["tourist", "passenger", "voyager", "wayfarer"],
    "wordFamily": {
      "noun": ["traveler", "travel"],
      "verb": ["travel"]
    }
  },
  "w_b2_113": {
    "synonyms": ["knapsack", "rucksack", "pack", "haversack"],
    "wordFamily": {
      "noun": ["backpack", "backpacker", "backpacking"],
      "verb": ["backpack"]
    }
  },
  "w_b2_114": {
    "synonyms": ["monument", "milestone", "beacon", "signpost"],
    "wordFamily": {
      "noun": ["landmark"]
    }
  },
  "w_b2_115": {
    "synonyms": ["exit", "withdrawal", "parting", "egress"],
    "wordFamily": {
      "noun": ["departure"],
      "verb": ["depart"]
    }
  },
  "w_b2_116": {
    "synonyms": ["appearance", "entrance", "landing", "advent"],
    "wordFamily": {
      "noun": ["arrival"],
      "verb": ["arrive"]
    }
  },
  "w_b2_117": {
    "synonyms": ["athenaeum", "collection", "archive", "reading room"],
    "wordFamily": {
      "noun": ["library", "librarian", "librarianship"]
    }
  },
  "w_b2_118": {
    "synonyms": ["movie theater", "pictures", "multiplex", "flicks"],
    "wordFamily": {
      "noun": ["cinema", "cinematography", "cinematic"]
    }
  },
  "w_b2_119": {
    "synonyms": ["playhouse", "auditorium", "amphitheater", "arena"],
    "wordFamily": {
      "noun": ["theater", "theatrical", "theatrics"]
    }
  },
  "w_b2_120": {
    "synonyms": ["eatery", "bistro", "diner", "brasserie"],
    "wordFamily": {
      "noun": ["restaurant", "restaurateur"]
    }
  }
};

let content = fs.readFileSync(filePath, 'utf-8');

for (const [id, data] of Object.entries(enrichments)) {
  const idPattern = new RegExp(`"id":\\s*"${id}"`, 'g');
  const match = idPattern.exec(content);
  
  if (match) {
    const startIndex = match.index;
    const nextEntryMatch = content.indexOf('  {', startIndex + 1);
    const endIndex = nextEntryMatch !== -1 ? nextEntryMatch : content.lastIndexOf('];');
    
    let entry = content.substring(startIndex, endIndex);
    
    // Add synonyms
    if (data.synonyms && !entry.includes('"synonyms"')) {
      const lastPropertyIndex = entry.lastIndexOf('",');
      if (lastPropertyIndex !== -1) {
        const insertPos = entry.indexOf('\n', lastPropertyIndex) + 1;
        const synonymsStr = `    "synonyms": ${JSON.stringify(data.synonyms, null, 6).replace(/      /g, '      ')},\n`;
        entry = entry.slice(0, insertPos) + synonymsStr + entry.slice(insertPos);
      }
    }
    
    // Add wordFamily
    if (data.wordFamily && !entry.includes('"wordFamily"')) {
      const lastPropertyIndex = entry.lastIndexOf('",');
      if (lastPropertyIndex !== -1) {
        const insertPos = entry.indexOf('\n', lastPropertyIndex) + 1;
        const wordFamilyStr = `    "wordFamily": ${JSON.stringify(data.wordFamily, null, 6).replace(/      /g, '      ')},\n`;
        entry = entry.slice(0, insertPos) + wordFamilyStr + entry.slice(insertPos);
      }
    }
    
    content = content.substring(0, startIndex) + entry + content.substring(endIndex);
  }
}

fs.writeFileSync(filePath, content);
console.log('Enriched Band 2 Batch 12 successfully!');
