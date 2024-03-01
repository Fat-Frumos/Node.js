import { ShipModel } from "src/model/ship/ship.model";
import { ShipType } from "src/model/ship/ship.type";

export const shipsBot: ShipModel[] = [
  {
    position: { x: 5, y: 9 },
    direction: false,
    type: ShipType.HUGE,
    length: 4,
  },
  {
    position: { x: 4, y: 3 },
    direction: true,
    type: ShipType.LARGE,
    length: 3,
  },
  {
    position: { x: 0, y: 5 },
    direction: false,
    type: ShipType.LARGE,
    length: 3,
  },
  {
    position: { x: 3, y: 0 },
    direction: true,
    type: ShipType.MEDIUM,
    length: 2,
  },
  {
    position: { x: 6, y: 4 },
    direction: false,
    type: ShipType.MEDIUM,
    length: 2,
  },
  {
    position: { x: 0, y: 7 },
    direction: false,
    type: ShipType.MEDIUM,
    length: 2,
  },
  {
    position: { x: 6, y: 0 },
    direction: true,
    type: ShipType.SMALL,
    length: 1,
  },
  {
    position: { x: 2, y: 9 },
    direction: false,
    type: ShipType.SMALL,
    length: 1,
  },
  {
    position: { x: 1, y: 3 },
    direction: false,
    type: ShipType.SMALL,
    length: 1,
  },
  {
    position: { x: 4, y: 7 },
    direction: true,
    type: ShipType.SMALL,
    length: 1,
  },
];
