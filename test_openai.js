// Simple test to verify OpenAI integration

async function testOpenAI() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a Texas STAAR test expert. Generate a simple 4th grade math question.'
          },
          {
            role: 'user',
            content: 'Create a 4th grade math question about fractions.'
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', JSON.stringify(data, null, 2));
    console.log('SUCCESS: OpenAI integration is working!');
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

testOpenAI();