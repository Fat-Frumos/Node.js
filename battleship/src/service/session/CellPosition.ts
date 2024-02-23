import { Position } from "../../model/board/position.model";

export class CellPosition implements Position{
  constructor(public x: number, public y: number) {}
}
