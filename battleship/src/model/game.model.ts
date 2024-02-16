import { Player } from "./player.model";
import { Ship } from "./ship.model";

export interface Game {
  id: number;
  players: Player[];
  ships: { [playerId: number]: Ship[] };
  currentPlayerIndex: number;
}
