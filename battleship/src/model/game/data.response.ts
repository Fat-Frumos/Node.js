import { RoomUser } from './types';
import { Position } from '../board/position.model';
import { AttackStatus } from '../ship/attack.status.type';

export type RegistrationResponse = {
  name: string;
  password: string;
};

export type PlayerRegistrationResponse = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type AddUserToRoomDataClient = {
  indexRoom: number;
};

export type CreateGameDataServer = {
  idGame: number;
  idPlayer: number;
};

export type AddShipsDataClient = {
  gameId: number;
  ships: [];
  indexPlayer: number;
};

export type StartGameDataServer = Omit<AddShipsDataClient, 'indexPlayer'> & {
  currentPlayerIndex: number;
};

export type TurnDataServer = {
  currentPlayer: number;
};

export type AttackResponse = {
  gameId: number;
  position: Position;
  indexPlayer: number;
};

export type AttackDataServer = {
  position: Position;
  currentPlayer: number;
  status: AttackStatus;
};

export type RandomAttackDataClient = {
  gameId: number;
  index: number;
};

export type AttackService = AttackResponse & {
  enemyId: number;
  enemyBoard: Map<string, boolean>;
};

export type FinishDataServer = {
  winPlayer: number;
};

export type UpdateWinnersDataServer = {
  name: string;
  wins: number;
};

export type UpdateRoomDataServer = {
  roomId: number;
  roomUsers: RoomUser[];
};
