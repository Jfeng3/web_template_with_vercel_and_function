import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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"
});

async function testKey() {
  try {
    console.log('Testing OpenAI API key...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10
    });
    console.log('✅ API key is valid!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ API key test failed:', error.message);
  }
}

testKey();