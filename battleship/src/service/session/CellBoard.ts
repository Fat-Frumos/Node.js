import { Cell } from "../../model/board/cell.model";
import { Position } from "../../model/board/position.model";

export class CellBoard implements Cell {
  
  position: Position;
  isOccupied: boolean;
  isHit: boolean;
  
  constructor(position: Position) {
    this.position = position;
    this.isOccupied = false;
    this.isHit = false;
  }
}
