import { Command } from "../model/command.model";
import { Room } from "../model/room.model";
import { Player } from "../model/player.model";

const players: Player[] = [];
let roomIdCounter = 1;
const rooms: Room[] = [];

export function handleResponse(message: string, ws: WebSocket) {
  try {
    const request = JSON.parse(message);
    const { command, data } = request;
    
    switch (data) {
      case Command.REGISTRATION:
        return handleRegistration(request.data, ws);
      case Command.CREATE_ROOM:
        return createRoom(request.data, ws);
      case Command.ADD_USER:
        return addUserToRoom(request.data, ws);
      default:
        console.log("Unsupported command:", command);
        return null;
    }
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
}

export function handleRequest(message: string, ws: WebSocket) {
  try {
    const data = JSON.parse(message);
    const { type } = data;
    
    switch (type) {
      case Command.REGISTRATION:
        handleRegistration(data, ws);
        break;
      case Command.CREATE_ROOM:
        createRoom(data, ws);
        break;
      case Command.ADD_USER:
        addUserToRoom(data, ws);
        break;
      default:
        console.log("Unknown message type:", type);
    }
  } catch (error) {
    console.error("Error parsing message:", error);
  }
}

export function handleRegistration(data: any, ws: WebSocket) {
  const { name } = data;
  const id = players.length + 1;
  players.push({ id, name, password: "", ships: [] });
  const response = JSON.stringify({ type: Command.REGISTRATION, data: { name, id }, id: 0 });
  ws.send(response);
}

export function createRoom(data: any, ws: WebSocket) {
  const roomId = roomIdCounter++;
  const room = { id: roomId, players: [] };
  rooms.push(room);
  const response = JSON.stringify({ type: Command.CREATE_ROOM, data: { roomId }, id: 0 });
  ws.send(response);
}

export function addUserToRoom(data: any, ws: WebSocket) {
  const { roomId, playerId } = data;
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    room.players.push(playerId);
    const response = JSON.stringify({ type: Command.ADD_USER, data: { roomId, playerId }, id: 0 });
    ws.send(response);
  } else {
    console.log("Room not found:", roomId);
  }
}
