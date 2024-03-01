import { Position } from './position.model';
import { AttackStatus } from '../ship/attack.status.type';

export interface Cell{
  position: Position;
  isOccupied: boolean;
  status: AttackStatus;
}
