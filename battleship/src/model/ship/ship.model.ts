import { ShipType } from "./ship.type";
import { Position } from "../board/position.model";

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
}
