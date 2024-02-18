import { Position } from "../../model/board/position.model";

export class PositionCell implements Position{
  constructor(public x: number, public y: number) {}
}
