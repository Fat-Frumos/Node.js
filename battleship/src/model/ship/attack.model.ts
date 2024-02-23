import { Position } from "../board/position.model";

export interface Attack {
  gameId: number;
  position: Position;
  indexPlayer: string;
}
