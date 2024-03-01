import { v4 as uuidv4 } from 'uuid';
import { DataLayerFacade } from '../dao/data.layer';
import { Command } from '../model/game/command.type';
import { Position } from '../model/board/position.model';
import { AttackStatus } from '../model/ship/attack.status.type';
import {
  AddShipsResponse,
  AddUserToRoomResponse,
  AttackFeedbackResponse,
  BaseEntities,
  BaseEntity,
  CreateGameResponse,
  CreateRoomResponse,
  FinishGameResponse,
  RandomAttackResponse,
  ResponseData,
  ResponseMessage,
  RoomStateUpdateResponse,
  StartGameResponse,
} from '../model/game/response.model';
import { Room } from '../model/room/room.model';
import { Board } from '../model/board/board.model';
import { BoardNotFound } from '../exception/BoardNotFound';
import { User } from '../model/game/user.model';
import { PlayerNotFound } from '../exception/PlayerNotFound';
import { PlayerAlreadyExists } from '../exception/PlayerAlreadyExists';
import { Session } from '../model/game/session.model';
import { SessionAlreadyExists } from '../exception/SessionAlreadyExists';
import { SessionNotFound } from '../exception/SessionNotFound';
import { RegistrationResponse } from "src/model/game/data.response";

const dao: DataLayerFacade = new DataLayerFacade();

export function signUp(response: BaseEntity<RegistrationResponse>): ResponseMessage {
  const { data } = response;
  const id = generateId();
  const playerId = generateId();
  const user = dao.createUser(id, data);
  if (user) throw new PlayerAlreadyExists(data.name);
  return register(id, data.name, playerId);
}

export function createRoom(response: BaseEntity<CreateRoomResponse>): ResponseMessage {
  const { id } = response;
  const room = dao.createRoom(id);
  return updateRoom(id, [room]);
}

export function addUserToRoom(response: BaseEntity<AddUserToRoomResponse>): ResponseMessage {
  const { id, data } = response;
  const { indexRoom } = data;
  const updatedRoom = dao.updateRoom(id, indexRoom);
  const room = updatedRoom.roomUsers.length >= 2 ? dao.createRoom(indexRoom) : updatedRoom;
  return updateRoom(id, [room]);
}

export function updateStateRoom(response: BaseEntities<RoomStateUpdateResponse>): ResponseMessage {
  const { id, data } = response;
  return updateRoom(id, dao.updatesRoom(data));
}

export function addShipToBoard(response: BaseEntity<AddShipsResponse>): ResponseMessage {
  const { id, data } = response;
  const occupied = dao.addShipPositionInBoard(data);
  return { id, type: Command.add_ships, data: JSON.stringify(occupied) };
}

export function userAttack(request: BaseEntity<AttackFeedbackResponse>): ResponseMessage {
  const { data, id } = request;

  const boards: Board[] | undefined = dao.sessions.find(
    (session) => session.indexPlayer === data.currentPlayer,
  )?.boards;

  if (!boards || boards.length === 0) {
    throw new BoardNotFound(String(data.currentPlayer));
  }

  const user = dao.getUserById(data.currentPlayer);
  if (!user) throw new PlayerNotFound(String(data.currentPlayer));

  const board = boards[0];
  const { position } = data;
  const { x, y } = position;

  if (position.x === undefined || position.y === undefined) {
    position.x = dao.getRandomInt(0, 10);
    position.y = dao.getRandomInt(0, 10);
  }

  const cell = board.cells[x][y];

  if (!cell.isOccupied) {
    return {
      type: Command.attack,
      data: JSON.stringify({ position, status: AttackStatus.miss }),
      id,
    };
  }

  cell.status = AttackStatus.shot;

  let isKilled = true;
  let liveShips = 0;
  for (const ship of board.ships) {
    if (ship.position.x === x && ship.position.y === y && cell.status !== AttackStatus.shot) {
      isKilled = false;
      liveShips++;
      break;
    }
  }

  if (liveShips === 0) {
    updateWinners(user);
    return finish(id, data.currentPlayer);
  }

  dao.turnShip(id);
  return feedbackAttack(isKilled, id, position);
}

export function randomAttack(response: BaseEntity<RandomAttackResponse>): ResponseMessage {
  const { id, data } = response;
  const { indexPlayer, gameId } = data;

  const user = dao.getUserById(indexPlayer);
  if (!user) throw new PlayerNotFound(String(gameId));
  const session = dao.getSession(gameId);
  if (!session) throw new SessionNotFound(String(gameId));

  const position = dao.getRandomAttack(user.indexPlayer);

  if (!position) {
    updateWinners(user);
    return finish(gameId, indexPlayer);
  }

  const status: AttackStatus = dao.useAttack(position, data.indexPlayer, data.gameId);

  if (status === AttackStatus.finish) {
    updateWinners(user);
    return finish(gameId, indexPlayer);
  }

  if (status === AttackStatus.miss) {
    dao.turnShip(data.gameId, true);
    return feedbackAttack(false, id, position);
  }

  dao.turnShip(gameId);
  return turnedAttack(id, position, indexPlayer);
}

export function finishGame(response: BaseEntity<FinishGameResponse>): ResponseMessage {
  const { id, data } = response;
  return finish(id, data.winPlayer);
}

export function updateWinners(user: User): void {
  dao.increaseWin(user.name);
}

export function createGame(response: BaseEntity<CreateGameResponse>): ResponseMessage {
  const { id, data } = response;
  const session = dao.getSession(data.idGame);
  const user = dao.getUserById(data.idPlayer);
  if (!session) throw new SessionNotFound(String(data.idGame));
  if (!user) throw new PlayerNotFound(String(data.idPlayer));
  const existingRoomIndex = session.rooms.findIndex((room) => room.roomUsers.some((user) => user.indexPlayer === data.idPlayer));
  if (existingRoomIndex !== -1) {
    session.rooms[existingRoomIndex].roomUsers.splice(existingRoomIndex, 1);
    throw new PlayerAlreadyExists(`${data.idPlayer}`);
  }
  const userIds = session.rooms.flatMap((room) => room.roomUsers.map((user) => user.indexPlayer));
  userIds.forEach((userID) => session.rooms.push(dao.createRoom(userID)));

  return {
    id,
    type: Command.create_game,
    data: JSON.stringify({
      idGame: data.idGame,
      idPlayer: data.idPlayer,
    }),
  };
}

export function createSession(playerIndex: number): Session {
  if (dao.sessions.some((session) => session.indexPlayer === playerIndex)) {
    throw new SessionAlreadyExists(String(playerIndex));
  }
  return {
    ships: [],
    rooms: [],
    gameId: generateId(),
    boards: [],
    indexPlayer: playerIndex,
  };
}

export function startGame(response: BaseEntity<StartGameResponse>): ResponseMessage {
  const { id, data } = response;
  const playerIndex = data.currentPlayerIndex;
  const player = dao.getUserById(playerIndex);
  if (!player) throw new PlayerNotFound('Player not found, register before start');
  let session = dao.getSessionByPlayerId(playerIndex);
  if (!session) session = createSession(playerIndex);

  const game = dao.startGame(session);

  return {
    type: Command.start_game,
    id,
    data: JSON.stringify(game),
  };
}

export function addBot(data: BaseEntities<ResponseData>): ResponseMessage {
  return {} as ResponseMessage;
}

export function generateId(): number {
  return Number(uuidv4());
}

export function errorHandler(error: unknown): ResponseMessage {
  const data = {
    errorText: error instanceof Error
      ? error.message
      : 'An unknown error occurred',
    error: true,
  };
  return {
    type: Command.error,
    id: 0,
    data: JSON.stringify(data),
  };
}

function feedbackAttack(isKilled: boolean, id: number, position: Position): ResponseMessage {
  return {
    id,
    type: Command.attack,
    data: JSON.stringify({
      position,
      status: isKilled ? AttackStatus.killed : AttackStatus.shot,
    }),
  };
}

export function register(id: number, name: string, indexPlayer: number): ResponseMessage {
  return {
    id,
    type: Command.reg,
    data: JSON.stringify({
      name,
      index: indexPlayer,
    }),
  };
}

export function updateRoom(id: number, rooms: Room[]): ResponseMessage {
  return {
    id,
    type: Command.update_room,
    data: JSON.stringify(rooms),
  };
}

function turnedAttack(id: number, position: Position, indexPlayer: number): ResponseMessage {
  return {
    id,
    type: Command.attack,
    data: JSON.stringify([{
      position,
      status: AttackStatus.shot,
      currentPlayer: indexPlayer,
    }]),
  };
}

function finish(id: number, winPlayer: number): ResponseMessage {
  return {
    id,
    type: Command.finish,
    data: JSON.stringify({ winPlayer }),
  };
}
