import { ShipType } from './ship.type';
import { Position } from '../board/position.model';

export interface ShipModel {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
}
