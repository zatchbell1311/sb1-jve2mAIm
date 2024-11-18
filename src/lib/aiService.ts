import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
}

export async function rewriteContent(content: string): Promise<string> {
  if (!openai) {
    console.log('No OpenAI API key found. Returning original content.');
    return content;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional news editor. Rewrite the following news content in a clear, concise, and engaging way while maintaining accuracy."
        },
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content || content;
  } catch (error) {
    console.error('Error rewriting content:', error);
    return content;
  }
}