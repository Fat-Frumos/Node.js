import { Winner } from "./winner.model";
import { Room } from "../room/room.model";
import { Board } from "../board/board.model";
import { ShipModel } from "src/model/ship/ship.model";

export interface Session {
  ships: ShipModel[];
  rooms: Room[];
  gameId: number;
  boards: Board[];
  winners?: Winner[];
  indexPlayer: number;
}
