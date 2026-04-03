import * as fs from 'fs';

const content = fs.readFileSync('./src/data/roadmap_vocab.ts', 'utf-8');
const arrayStart = content.indexOf('[');
const arrayEnd = content.lastIndexOf(']');
const arrayString = content.substring(arrayStart, arrayEnd + 1);
const CAMBRIDGE_ROADMAP = eval('(' + arrayString + ')');

const bandIds: Record<number, number[]> = {};

CAMBRIDGE_ROADMAP.forEach((item: any) => {
    const band = item.band;
    const idMatch = item.id.match(/w_b\d+_(\d+)/);
    if (idMatch) {
        const idNum = parseInt(idMatch[1]);
        if (!bandIds[band]) {
            bandIds[band] = [];
        }
        bandIds[band].push(idNum);
    }
});

Object.keys(bandIds).forEach(bandStr => {
    const band = parseInt(bandStr);
    const ids = bandIds[band].sort((a, b) => a - b);
    console.log(`Band ${band}: Min=${ids[0]}, Max=${ids[ids.length - 1]}, Count=${ids.length}`);
    
    const missing = [];
    for (let i = 1; i <= ids[ids.length - 1]; i++) {
        if (!ids.includes(i)) {
            missing.push(i);
        }
    }
    if (missing.length > 0) {
        console.log(`  Missing IDs: ${missing.join(', ')}`);
    } else {
        console.log(`  No missing IDs.`);
    }
});
