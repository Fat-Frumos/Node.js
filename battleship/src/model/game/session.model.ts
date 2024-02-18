import { Player } from "./player.model";
import { Board } from "../../service/session/Board";

export interface Session {
  board: Board;
  sessionId: number;
  players: Player[];
}
