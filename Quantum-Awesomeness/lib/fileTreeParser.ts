import { z } from 'zod';

export interface FileNode {
  path: string;
  content: string;
}

const FileSchema = z.object({
  path: z.string(),
  content: z.string()
});

export function parseAIResponseToFileTree(aiResponse: string): FileNode[] {
  const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      return z.array(FileSchema).parse(parsed.files);
    } catch {
      // fall through
    }
  }

  const files: FileNode[] = [];
  const codeBlocks = aiResponse.matchAll(/```(?:\w+)?\s*([\s\S]*?)\s*```/g);

  for (const match of codeBlocks) {
    const content = match[1];
    const path = extractPathFromContent(content) || `file-${files.length}.txt`;
    files.push({ path, content });
  }

  return files;
}

function extractPathFromContent(content: string): string | null {
  const pathComment = content.match(/\/\/\s*@file:\s*(.+)/) || 
                     content.match(/#\s*@file:\s*(.+)/) ||
                     content.match(/{\s*@path:\s*(.+)\s*}/);
  return pathComment ? pathComment[1].trim() : null;
}
