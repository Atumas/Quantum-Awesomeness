'use client';

import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface Props {
  code: string;
  onChange: (value: string) => void;
  onCodeChange?: (value: string) => void;
}

export default function CodeEditor({ code, onChange, onCodeChange }: Props) {
  const { theme } = useTheme();

  const handleChange = (value?: string) => {
    const v = value ?? '';
    onChange(v);
    if (onCodeChange) {
      onCodeChange(v);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-400">Generated Project</span>
        <div className="flex gap-2">
          <button className="text-xs bg-slate-700 px-2 py-1 rounded">Format</button>
          <button
            className="text-xs bg-slate-700 px-2 py-1 rounded"
            onClick={() => navigator.clipboard.writeText(code)}
          >
            Copy
          </button>
        </div>
      </div>
      <Editor
        height="100%"
        language="typescript"
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={code}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          folding: true,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
        }}
      />
    </div>
  );
}
