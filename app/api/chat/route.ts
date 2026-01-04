import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model: requestedModel } = await req.json();

  const model = requestedModel || 'google/gemini-1.5-flash';

  const result = streamText({
    model: model,
    messages: await convertToModelMessages(messages),
    system: 'You are a helpful, premium AI assistant. Respond with clear, concise, and helpful answers.',
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
  });
}
