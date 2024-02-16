import { ShipType } from "./ship.type";
import { Position } from "./position";

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
}
