'use client';

import { useState, useRef } from 'react';
import { useChat } from 'ai/react';

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { append } = useChat();

  const startListening = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      append({
        role: 'user',
        content: transcript,
      });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`forge-button ${isListening ? 'animate-pulse bg-red-500' : ''}`}
      title="Click and speak your app idea"
    >
      {isListening ? '🎙️ Listening...' : '🎤 Voice Input'}
    </button>
  );
}
