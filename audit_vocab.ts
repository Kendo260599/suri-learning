import * as fs from 'fs';

const content = fs.readFileSync('./src/data/roadmap_vocab.ts', 'utf-8');
const arrayStart = content.indexOf('[');
const arrayEnd = content.lastIndexOf(']');
const arrayString = content.substring(arrayStart, arrayEnd + 1);
const CAMBRIDGE_ROADMAP = eval('(' + arrayString + ')');

const stats = {
    total: CAMBRIDGE_ROADMAP.length,
    missingIPA: 0,
    missingSynonyms: 0,
    missingAntonyms: 0,
    missingWordFamily: 0,
    missingParaphrasePairs: 0,
    genericTopic: 0, // Topic ending in -1
};

CAMBRIDGE_ROADMAP.forEach((item: any) => {
    if (!item.ipa) stats.missingIPA++;
    if (!item.synonyms || item.synonyms.length === 0) stats.missingSynonyms++;
    if (!item.antonyms || item.antonyms.length === 0) stats.missingAntonyms++;
    if (!item.wordFamily) stats.missingWordFamily++;
    if (!item.paraphrasePairs || item.paraphrasePairs.length === 0) stats.missingParaphrasePairs++;
    if (item.topicId.endsWith('-1')) stats.genericTopic++;
});

console.log('Vocabulary Audit Stats:');
console.log(JSON.stringify(stats, null, 2));
