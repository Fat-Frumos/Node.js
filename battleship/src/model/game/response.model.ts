import { Ship } from "../ship/ship.model";
import { AttackStatus } from "../ship/attack.status.type";
import { Command } from "./command.type";
import { Position } from "../board/position.model";
import { Winner } from "./winner.model";
import { RoomUser } from "../room/room.user.model";

export interface ResponseMessage {
  type: Command;
  id: number;
  data: string;
}

export interface Socket extends WebSocket {
  id: number;
  on(event: string, listener: (...args: any[]) => void): void;
}

export interface ResponseData {
}

export interface BaseEntity<ResponseData> {
  type: Command;
  id: number;
  data: ResponseData;
}

export interface BaseEntities<ResponseData> {
  type: Command;
  id: number;
  data: ResponseData[];
}

export interface RegistrationResponse extends ResponseData {
  name: string;
  password: string;
}

export interface PlayerRegistrationResponse extends ResponseData {
  name: string;
  index?: number;
  error?: boolean;
  errorText?: string;
}

export interface RoomStateUpdateResponse extends ResponseData{
  roomId: number;
  roomUsers: RoomUser[];
}

export interface UpdateWinnersResponse extends ResponseData {
  name: string;
  winners: Winner[];
}

export interface CreateRoomResponse extends ResponseData {
  data: string;
}

export interface AddUserToRoomResponse extends ResponseData {
  indexRoom: number;
}

export interface CreateGameResponse extends ResponseData {
  idGame: number;
  idPlayer: number;
}

export interface AddShipsResponse extends ResponseData {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface StartGameResponse extends ResponseData {
  ships: Ship[];
  currentPlayerIndex: number;
}

export interface AttackResponse extends ResponseData {
  gameId: number;
  position: Position;
  indexPlayer: number;
}

export interface AttackFeedbackResponse extends ResponseData {
  position: Position;
  currentPlayer: number;
  status: AttackStatus;
}

export interface RandomAttackResponse extends ResponseData {
  gameId: number;
  indexPlayer: number;
}

export interface PlayerTurnInfoResponse extends ResponseData{
  currentPlayer: number;
}

export interface FinishGameResponse extends ResponseData{
  winPlayer: number;
}
