'use client';

import { SandpackProvider, SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';
import { sandpackDark } from '@codesandbox/sandpack-themes';

interface Props {
  code: string;
  framework: string;
}

export default function LivePreview({ code, framework }: Props) {
  const getTemplate = () => {
    switch (framework) {
      case 'react': return 'react-ts';
      case 'vue': return 'vue-ts';
      case 'vanilla': return 'vanilla-ts';
      default: return 'react-ts';
    }
  };

  let files: any = { '/App.tsx': code || 'export default function App() { return <div>AppForge Preview</div>; }' };

  try {
    if (code.includes('```json')) {
      const match = code.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        const parsed = JSON.parse(match[1]);
        if (parsed.files) {
          files = {};
          for (const f of parsed.files) {
            files[`/${f.path}`] = f.content;
          }
        }
      }
    }
  } catch {
    // fallback to simple app
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-800 px-3 py-2 border-b border-slate-700">
        <span className="text-xs text-slate-400">Live Preview (Sandpack)</span>
      </div>
      <SandpackProvider
        template={getTemplate()}
        theme={sandpackDark}
        files={files}
        options={{
          activeFile: Object.keys(files)[0] || '/App.tsx'
        }}
      >
        <SandpackLayout style={{ height: '100%', border: 'none' }}>
          <SandpackPreview style={{ height: '100%' }} />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
