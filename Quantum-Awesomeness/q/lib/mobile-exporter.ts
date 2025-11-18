import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { FileNode } from '@/lib/fileTreeParser';

/**
 * Converts a React web app into either React Native (Expo) or Capacitor hybrid app.
 * Returns a JSON-like file tree structure.
 */
export async function exportToMobile(
  webCode: string,
  platform: 'react-native' | 'capacitor'
): Promise<{ files: FileNode[] }> {
  const target =
    platform === 'react-native' ? 'React Native with Expo' : 'Capacitor hybrid app';

  const result = await streamText({
    model: openai('gpt-4.1-mini'),
    messages: [
      {
        role: 'system',
        content:
          'You are a senior cross-platform engineer. You convert React web apps into mobile apps (React Native / Capacitor).'
      },
      {
        role: 'user',
        content: `Convert this React web app to ${target}:

${webCode}

Transform:
- div -> View/SafeAreaView
- button -> TouchableOpacity
- input -> TextInput
- add platform-specific navigation
- handle native APIs (camera, location)
- generate app.json/capacitor.config.json
- include native modules

Return full mobile app code as JSON: { "files": [{ "path": "...", "content": "..." }] }`
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
