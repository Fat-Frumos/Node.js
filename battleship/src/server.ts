import { Server as WebSocketServer } from 'ws';
import { eventListener } from "./handler/factory";

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  ws.on("message", (message: string) => {
    const response = eventListener(message, ws);
    ws.send(JSON.stringify(response));
  });
  
  ws.on('close', () => {
    console.log('Connection closed');
  });
});

console.log('WebSocket server started on port 3000');
