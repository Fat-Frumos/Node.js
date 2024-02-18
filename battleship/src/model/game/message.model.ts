import { Position } from "../board/position.model";

export interface Message {
  playerId: number;
  sessionId: number;
  position: Position;
}
