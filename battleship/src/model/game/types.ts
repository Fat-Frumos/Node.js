import { Position } from 'src/model/board/position.model';
import { Command } from './command.type';
import { ShipType } from "src/model/ship/ship.type";

export type RequestType = {
  type: Command;
  data: string;
  id: 0;
};

export type RoomUser = {
  name: number;
  index: number;
};

export type ShipsType = {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
};
