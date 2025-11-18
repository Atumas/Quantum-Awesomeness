import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { promptFactory } from '@/lib/personaEngine';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, framework, appName, userType } = await req.json();

  const model = openai('gpt-4.1-mini') ?? openai('gpt-4-turbo');

  const stream = await streamText({
    model,
    messages: [
      {
        role: 'system',
        content: promptFactory({ framework, appName, userType })
      },
      ...messages
    ],
    temperature: 0.2,
    maxTokens: 4000
  });

  return stream.toDataStreamResponse();
}
