import { Ship } from "../ship/ship.model";

export interface Player {
  ships: Ship[];
  playerId: number;
  username: string;
  password: string;
}
