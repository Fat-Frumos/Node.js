import { WebSocket } from 'ws';
import { Command } from "../model/game/command.model";
import { finishGame, addBot, randomAttack, addShipToBoard, userAttack, startGame, addUserToRoom, createSession, signUp, updateRoom } from "./dispatcher";

export function eventListener(message: string, ws: WebSocket) {
  try {
    const request = JSON.parse(message);
    const { command, data } = request;
    
    switch (data) {
      case Command.REGISTRATION:
        return signUp(request.data, ws);
      case Command.CREATE_ROOM:
        return createSession(request.data, ws);
      case Command.ADD_USER:
        return addUserToRoom(request.data, ws);
      case Command.UPDATE_ROOM:
        return updateRoom(request.data, ws);
      case Command.ADD_SHIPS:
        return addShipToBoard(request.data, ws);
      case Command.START_GAME:
        return startGame(request.data, ws);
      case Command.ATTACK:
        return userAttack(request.data, ws);
      case Command.RANDOM:
        return randomAttack(request.data, ws);
      case Command.SINGLE:
        return addBot(request.data, ws);
      case Command.FINISH:
        return finishGame(request.data, ws);
      default:
        console.log("Unsupported command:", command);
        return null;
    }
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
}
