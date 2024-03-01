import { Game } from '../service/game/game';
import { Room } from '../service/game/room';
import { Player } from '../service/game/player';

export interface WebSocketWithDispatchEvent extends WebSocket {
  dispatchEvent: (event: Event) => boolean;
}

export type store = {
  userDb: Map<number, Player>;
  roomDb: Map<number, Room>;
  gameDb: Map<number, Game>;
  socketDb: { [id: string]: WebSocketWithDispatchEvent };
};

export const {
  userDb, roomDb, gameDb, socketDb,
}: store = {
  userDb: new Map<number, Player>(),
  roomDb: new Map<number, Room>(),
  gameDb: new Map<number, Game>(),
  socketDb: {} as { [id: string]: WebSocketWithDispatchEvent },
};
