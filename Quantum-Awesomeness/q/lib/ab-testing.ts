export interface ABVariant {
  id: string;
  name: string;
  code: any;
  hypothesis: string;
}

export async function generateABVariants(
  baseCode: string,
  variantCount: number = 3
): Promise<ABVariant[]> {
  const { streamText }: any = await import('ai');
  const { openai }: any = await import('@ai-sdk/openai');

  const variants: ABVariant[] = [];

  for (let i = 0; i < variantCount; i++) {
    const result: any = await streamText({
      model: openai('gpt-4-turbo-preview'),
      messages: [
        {
          role: 'user',
          content: `Create variant ${i + 1} of this app:
${baseCode}

Focus on:
- Different UI layout
- Alternative color scheme
- Unique interaction pattern
- Performance vs features tradeoff

Return only the code for variant ${i + 1}.`
        }
      ]
    });

    // In this minimal implementation we keep the AI stream reference;
    // the caller can decide how to consume it.
    const stream = result.toAIStream ? result.toAIStream() : result;

    variants.push({
      id: `variant-${i + 1}`,
      name: `Variant ${i + 1}`,
      code: stream,
      hypothesis: `Testing ${i % 2 === 0 ? 'performance' : 'feature-rich'} approach`
    });
  }

  return variants;
}
