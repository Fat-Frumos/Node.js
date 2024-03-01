import { Cell } from '../../model/board/cell.model';
import { Position } from '../../model/board/position.model';
import { AttackStatus } from '../../model/ship/attack.status.type';

export class BoardCell implements Cell {
  position: Position;

  isOccupied: boolean;

  status: AttackStatus;

  constructor(position: Position) {
    this.position = position;
    this.isOccupied = false;
    this.status = AttackStatus.undefined;
  }
}
