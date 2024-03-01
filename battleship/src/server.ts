import { Server as WebSocketServer } from 'ws';
import { eventListener } from './handler/factory';
import { Socket } from './model/game/response.model';

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws: Socket) => {
  ws.on('message', (message: string) => {
    const response = eventListener(message);
    ws.send(JSON.stringify(response));
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });
});

console.log('WebSocket server started on port 3000');
