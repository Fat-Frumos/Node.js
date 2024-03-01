import { AttackStatus } from 'src/model/ship/attack.status.type';
import { ShipType } from 'src/model/ship/ship.type';
import { Position } from 'src/model/board/position.model';
import { ShipModel } from 'src/model/ship/ship.model';

export class Ship {
  public position: Position;

  public direction: boolean;

  public length: number;

  public type: ShipType;

  public shipPosition: Map<string, boolean>;

  constructor({ position, direction, length, type, }: ShipModel) {
    this.position = position;
    this.direction = direction;
    this.length = length;
    this.type = type;
    this.shipPosition = this.generateShip();
  }

  private generateShip() {
    const map = new Map<string, boolean>();
    for (let i = 0; i < this.length; i += 1) {
      if (this.direction) {
        map.set(`${this.position.x}-${this.position.y + i}`, false);
      } else {
        map.set(`${this.position.x + i}-${this.position.y}`, false);
      }
    }
    return map;
  }

  getStatus(): AttackStatus {
    return Array.from(this.shipPosition.values()).every((value) => value)
      ? AttackStatus.killed : AttackStatus.shot;
  }
}
