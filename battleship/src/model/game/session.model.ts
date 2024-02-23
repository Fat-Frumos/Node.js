import { Winner } from "./winner.model";
import { Room } from "../room/room.model";
import { Board } from "../board/board.model";
import { Ship } from "../ship/ship.model";

export interface Session {
  ships: Ship[];
  rooms: Room[];
  gameId: number;
  boards: Board[];
  winners?: Winner[];
  indexPlayer: number;
}
