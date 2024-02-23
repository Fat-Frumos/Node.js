import { Ship } from "../ship/ship.model";
import { Cell } from "./cell.model";
import { User } from "../game/user.model";

export interface Board {
  ships: Ship[];
  width: number;
  height: number;
  cells: Cell[][];
  roomUsers: User[];
}
