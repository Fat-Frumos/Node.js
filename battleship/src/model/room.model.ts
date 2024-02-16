import { Player } from "./player.model";

export interface Room {
  id: number;
  players: Player[];
}
