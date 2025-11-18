import PartySocket from 'partykit/client';

interface CodeCursor {
  line: number;
  column: number;
}

export class CollaborationEngine {
  private socket: PartySocket | null = null;
  private room: string;

  constructor(roomId: string) {
    this.room = `appforge-${roomId}`;
  }

  connect(onMessage: (data: any) => void) {
    this.socket = new PartySocket({
      host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'localhost:1999',
      room: this.room
    });

    this.socket.addEventListener('message', (event: MessageEvent) => {
      try {
        onMessage(JSON.parse(event.data as any));
      } catch {
        // ignore invalid messages
      }
    });

    this.socket.addEventListener('open', () => {
      console.log('🔌 Connected to collaboration room:', this.room);
    });
  }

  broadcastCodeChange(code: string, cursor: CodeCursor) {
    if (!this.socket) return;

    this.socket.send(JSON.stringify({
      type: 'CODE_CHANGE',
      payload: { code, cursor },
      user: {
        id: 'self',
        name: 'You',
      },
      timestamp: Date.now()
    }));
  }

  broadcastDeploymentStatus(status: any) {
    if (!this.socket) return;

    this.socket.send(JSON.stringify({
      type: 'DEPLOYMENT_UPDATE',
      payload: status,
      user: {
        id: 'self',
        name: 'You',
      },
      timestamp: Date.now()
    }));
  }

  disconnect() {
    this.socket?.close();
  }
}

export const collab = new CollaborationEngine('global-room');
