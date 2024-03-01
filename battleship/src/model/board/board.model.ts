import { Cell } from './cell.model';
import { User } from '../game/user.model';
import { ShipModel } from "src/model/ship/ship.model";

export interface Board {
  ships: ShipModel[];
  width: number;
  height: number;
  cells: Cell[][];
  roomUsers: User[];
}
