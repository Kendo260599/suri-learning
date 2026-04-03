import { Project, SyntaxKind, ObjectLiteralExpression, ArrayLiteralExpression } from 'ts-morph';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const VOCAB_FILE = path.join(process.cwd(), 'src', 'data', 'roadmap_vocab.ts');

async function generateParaphrases(word: string, meaning: string) {
  const prompt = `
Generate 2 high-quality paraphrase pairs for the English word "${word}" (meaning: ${meaning}).
Each pair must include:
1. original: A short phrase using the word.
2. paraphrased: A paraphrased version of the phrase.
3. originalSentence: A full sentence using the word.
4. paraphrasedSentence: A full sentence paraphrasing the original sentence.
5. method: The method used ('synonym', 'word_form', 'structure', or 'mixed').
6. explanation: A short explanation in Vietnamese of how the paraphrase was done.

Return ONLY a JSON array of these 2 objects.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              paraphrased: { type: Type.STRING },
              originalSentence: { type: Type.STRING },
              paraphrasedSentence: { type: Type.STRING },
              method: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['original', 'paraphrased', 'originalSentence', 'paraphrasedSentence', 'method', 'explanation'],
          },
        },
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (error) {
    console.error(`Error generating for ${word}:`, error);
  }
  return null;
}

async function main() {
  console.log('Starting paraphrase generation script...');
  
  const project = new Project();
  project.addSourceFileAtPath(VOCAB_FILE);
  const sourceFile = project.getSourceFileOrThrow(VOCAB_FILE);
  
  const variableDeclaration = sourceFile.getVariableDeclaration('CAMBRIDGE_ROADMAP');
  if (!variableDeclaration) {
    console.error('Could not find CAMBRIDGE_ROADMAP');
    return;
  }
  
  const initializer = variableDeclaration.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
  if (!initializer) {
    console.error('CAMBRIDGE_ROADMAP is not an array literal');
    return;
  }
  
  const elements = initializer.getElements();
  let processedCount = 0;
  
  // We only process a few words at a time to avoid hitting rate limits or taking too long
  const MAX_TO_PROCESS = 5; 
  
  for (const element of elements) {
    if (processedCount >= MAX_TO_PROCESS) {
      break;
    }
    
    if (element.getKind() === SyntaxKind.ObjectLiteralExpression) {
      const obj = element as ObjectLiteralExpression;
      
      const wordProp = obj.getProperty('word');
      const meaningProp = obj.getProperty('vietnameseDefinition');
      const paraphraseProp = obj.getProperty('paraphrasePairs');
      
      if (wordProp && meaningProp && !paraphraseProp) {
        // Extract values
        const wordText = wordProp.getText().replace(/word:\s*['"](.*)['"]/, '$1');
        const meaningText = meaningProp.getText().replace(/vietnameseDefinition:\s*['"](.*)['"]/, '$1');
        
        console.log(`Generating paraphrases for: ${wordText}`);
        const pairs = await generateParaphrases(wordText, meaningText);
        
        if (pairs && pairs.length > 0) {
          // Format as string
          const pairsString = JSON.stringify(pairs, null, 2).replace(/"([^"]+)":/g, '$1:');
          
          // Add property
          obj.addPropertyAssignment({
            name: 'paraphrasePairs',
            initializer: pairsString
          });
          
          processedCount++;
          console.log(`Successfully added paraphrases for ${wordText}`);
        }
      }
    }
  }
  
  if (processedCount > 0) {
    console.log(`Saving changes for ${processedCount} words...`);
    await sourceFile.save();
    console.log('Done!');
  } else {
    console.log('No words needed updating or max limit reached.');
  }
}

main().catch(console.error);
