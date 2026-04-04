console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('API_KEY exists:', !!process.env.API_KEY);
console.log('Keys:', Object.keys(process.env).filter(k => k.includes('KEY') || k.includes('API')));
