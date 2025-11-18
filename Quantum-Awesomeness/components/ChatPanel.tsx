'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

interface Props {
  onCodeGenerated: (code: string) => void;
  framework: string;
  appName: string;
  quantumMode?: boolean;
}

export default function ChatPanel({ onCodeGenerated, framework, appName, quantumMode }: Props) {
  const [userType, setUserType] = useState('startup');

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { framework, appName, userType, quantumMode },
    onFinish: (message) => {
      const codeMatch = message.content.match(/```[\s\S]*?\n([\s\S]*?)```/);
      if (codeMatch) {
        onCodeGenerated(codeMatch[1]);
      }
    }
  });

  const suggestions = [
    'Build a task manager with drag-and-drop',
    'Create a real-time chat app with WebSockets',
    'Make a portfolio website with 3D animations',
    'Generate an e-commerce site with Stripe'
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-semibold mb-2">👤 Persona</h3>
        <select 
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full forge-input"
        >
          <option value="startup">🚀 Startup MVP</option>
          <option value="enterprise">🏢 Enterprise Scale</option>
          <option value="education">🎓 Educational</option>
          <option value="indie">💡 Indie Hacker</option>
          <option value="performance">⚡ Performance</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`p-3 rounded-lg ${
            m.role === 'user' ? 'bg-blue-900/50 ml-8' : 'bg-slate-800/50 mr-8'
          }`}>
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex gap-2 mb-3 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleInputChange({ target: { value: s } } as any)}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition"
            >
              {s.split(' ').slice(0, 2).join(' ')}...
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={quantumMode ? 'Describe your multi-AI super app idea...' : 'Describe your app idea...'}
            className="flex-1 forge-input"
          />
          <button 
            type="submit"
            className="forge-button"
          >
            Forge
          </button>
        </form>
      </div>
    </div>
  );
}
