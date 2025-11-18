import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { FileNode } from '@/lib/fileTreeParser';

/**
 * Natural language → backend file tree generator.
 * Returns a JSON-compatible structure: { files: [{ path, content }, ...] }
 */
export async function generateBackendSchema(
  description: string
): Promise<{ files: FileNode[] }> {
  const result = await streamText({
    model: openai('gpt-4.1-mini'),
    messages: [
      {
        role: 'system',
        content:
          'You are a senior backend architect. You design PostgreSQL schemas, Prisma schemas, API routes, and auth plumbing for Next.js apps.'
      },
      {
        role: 'user',
        content: `Generate a complete backend from this description:

${description}

Include:
1. PostgreSQL schema (CREATE TABLE statements)
2. Prisma schema
3. API routes (Next.js API handlers)
4. Authentication (NextAuth or Clerk-ready stubs)
5. Real-time subscriptions (Supabase-ready stubs)
6. Full file tree with all files

Return as strict JSON: { "files": [{ "path": "...", "content": "..." }] }`
      },
    ],
    temperature: 0.25,
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
