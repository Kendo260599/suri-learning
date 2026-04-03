import * as fs from 'fs';

const content = fs.readFileSync('./src/data/roadmap_vocab.ts', 'utf-8');
const idMatches = [...content.matchAll(/"?id"?:\s*"([^"]+)"/g)].map(m => m[1]);

const bandCounts: Record<string, number> = {};
idMatches.forEach(id => {
  const match = id.match(/^w_b(\d+)_/);
  if (match) {
    const band = match[1];
    bandCounts[band] = (bandCounts[band] || 0) + 1;
  }
});

console.log('Band counts:');
Object.entries(bandCounts).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(([band, count]) => {
  console.log(`Band ${band}: ${count}`);
});
