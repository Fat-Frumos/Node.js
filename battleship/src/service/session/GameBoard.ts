import { Cell } from 'src/model/board/cell.model';
import { Position } from 'src/model/board/position.model';
import { AttackStatus } from 'src/model/ship/attack.status.type';
import { Board } from 'src/model/board/board.model';
import { User } from 'src/model/game/user.model';
import { ShipModel } from 'src/model/ship/ship.model';
import { CellPosition } from './CellPosition';
import { BoardCell } from './BoardCell';

export class GameBoard implements Board {
  public width: number;

  public height: number;

  public ships: ShipModel[];

  public cells: Cell[][];

  public roomUsers: User[] = [];

  constructor(size: number) {
    this.ships = [];
    this.cells = [];
    this.width = size;
    this.height = size;

    for (let x = 0; x < size; x++) {
      this.cells[x] = [];
      for (let y = 0; y < size; y++) {
        this.cells[x][y] = new BoardCell(new CellPosition(x, y));
      }
    }
  }

  isAttackStatusHit(position: Position): boolean {
    const { x, y } = position;
    return this.cells[x][y].status === AttackStatus.killed;
  }

  public setCellStatus(position: Position, status: AttackStatus): void {
    const { x, y } = position;
    this.cells[x][y].status = status;
  }

  getCellStatus(position: Position): AttackStatus {
    const { x, y } = position;
    const cell = this.cells[x][y];
    return cell.status;
  }
}
