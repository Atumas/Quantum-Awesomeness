export class AutoDebugger {
  private static instance: AutoDebugger;
  private listening = false;

  static getInstance(): AutoDebugger {
    if (!AutoDebugger.instance) {
      AutoDebugger.instance = new AutoDebugger();
    }
    return AutoDebugger.instance;
  }

  listenForErrors() {
    if (typeof window === 'undefined' || this.listening) return;
    this.listening = true;

    window.addEventListener('error', (event) => {
      try {
        fetch('/api/error', {
          method: 'POST',
          body: JSON.stringify({
            type: 'error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          }),
        });
      } catch {
        // ignore
      }
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      try {
        fetch('/api/error', {
          method: 'POST',
          body: JSON.stringify({
            type: 'unhandledrejection',
            reason: String(event.reason),
          }),
        });
      } catch {
        // ignore
      }
    });
  }
}
