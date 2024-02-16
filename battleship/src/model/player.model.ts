import { Ship } from "./ship.model";

export interface Player {
  id: number;
  name: string;
  password: string;
  ships: Ship[];
}
