import { ShipType } from "./ship.type";
import { Position } from "../board/position.model";
import { AttackStatus } from "./attack.status.type";

export interface Ship {
  userId: number;
  type: ShipType;
  length: number;
  positions: Position[];
  direction: boolean;
  status: AttackStatus;
}
