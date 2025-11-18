import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { FileNode } from '@/lib/fileTreeParser';

/**
 * Generates Jest / RTL / Cypress test suites as a JSON file tree.
 */
export async function generateTestSuite(code: string): Promise<{ files: FileNode[] }> {
  const result = await streamText({
    model: openai('gpt-4.1-mini'),
    messages: [
      {
        role: 'system',
        content:
          'You are a senior test engineer. You design Jest, React Testing Library and Cypress test suites.'
      },
      {
        role: 'user',
        content: `Generate comprehensive tests for this code:

${code}

Include:
1. Jest unit tests for all functions
2. React Testing Library component tests
3. Cypress E2E tests
4. Edge case testing
5. Mock data
6. Test coverage configuration

Return as JSON: { "files": [{ "path": "...", "content": "..." }] }`
      },
    ],
    temperature: 0.2,
    maxTokens: 4000,
  });

  let full = '';
  for await (const delta of result.fullStream) {
    if (delta.type === 'text-delta') {
      full += delta.textDelta;
    }
  }

  try {
    const jsonMatch = full.match(/\{[\s\S]*\}$/);
    const asJson = JSON.parse(jsonMatch ? jsonMatch[0] : full);
    return { files: asJson.files || [] };
  } catch {
    return { files: [] };
  }
}
