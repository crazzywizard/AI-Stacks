import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'google/gemini-3-flash',
    messages: await convertToModelMessages(messages),
    system: 'You are a helpful, premium AI assistant. Respond with clear, concise, and helpful answers.',
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
  });
}
