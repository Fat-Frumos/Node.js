import { Position } from "./position.model";

export interface Cell{
  position: Position;
  isOccupied: boolean;
  isHit: boolean;
}
