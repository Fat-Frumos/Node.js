import { Command } from "../model/game/command.type";
import {
  addBot,
  addShipToBoard,
  addUserToRoom,
  createRoom,
  createGame,
  errorHandler,
  finishGame,
  randomAttack,
  signUp,
  startGame,
  updateStateRoom,
  userAttack
} from "./dispatcher";
import { ResponseMessage } from "../model/game/response.model";

export function eventListener(message: string): ResponseMessage {
  
  try {
    const request = JSON.parse(message);
    console.log(request);
    const { command, data } = request;
    
    switch (command) {
      case Command.reg:
        return signUp(data);
      case Command.create_room:
        return createRoom(data);
      case Command.add_user_to_room:
        return addUserToRoom(data);
      case Command.update_room:
        return updateStateRoom(data);
      case Command.add_ships:
        return addShipToBoard(data);
      case Command.start_game:
        return startGame(data);
        case Command.create_game:
        return createGame(data);
      case Command.attack:
        return userAttack(data);
      case Command.randomAttack:
        return randomAttack(data);
      case Command.single:
        return addBot(data);
      case Command.finish:
        return finishGame(data);
      default: return errorHandler(command);
    }
  } catch (error: unknown) {
    return errorHandler(error);
  }
}
