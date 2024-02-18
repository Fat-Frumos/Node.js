import { Cell } from "../../model/board/cell.model";
import { CellBoard } from "./CellBoard";
import { PositionCell } from "./PositionCell";

export class Board {
  public size: number;
  public cells: Cell[][];
  
  constructor(size: number) {
    this.size = size;
    this.cells = [];
    
    for (let i = 0; i < size; i++) {
      this.cells[i] = [];
      for (let j = 0; j < size; j++) {
        this.cells[i][j] = new CellBoard(new PositionCell(i, j));
      }
    }
  }
}
