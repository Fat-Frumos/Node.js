import { Server as WebSocketServer } from 'ws';
import { handleRequest, handleResponse } from "./handler/commandHandler";

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  ws.on("message", (message: string) => {
    const response = handleResponse(message, ws);
    ws.send(JSON.stringify(response));
  });
  
  ws.on("message", (message: string) => {
    console.log("Received message:", message);
    handleRequest(message, ws);
  });
  
  ws.on('close', () => {
    console.log('Connection closed');
  });
});

console.log('WebSocket server started on port 3000');
