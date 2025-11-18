'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('AppForge Error:', error, errorInfo);
    fetch('/api/error', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        component: 'AppRoot'
      })
    }).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-900/30 border border-red-500 rounded-xl">
          <h2 className="text-xl font-bold mb-2 text-red-400">🚨 Something went wrong</h2>
          <p className="text-sm text-slate-300 mb-3">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
