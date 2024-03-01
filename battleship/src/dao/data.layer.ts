import { Room } from '../model/room/room.model';
import { Winner } from '../model/game/winner.model';
import { Session } from '../model/game/session.model';
import { Cell } from '../model/board/cell.model';
import {
  AddShipsResponse,
  RoomStateUpdateResponse,
  StartGameResponse,
} from '../model/game/response.model';
import { generateId } from '../handler/dispatcher';
import { User } from '../model/game/user.model';
import { AttackStatus } from '../model/ship/attack.status.type';
import { PlayerNotFound } from '../exception/PlayerNotFound';
import { Position } from '../model/board/position.model';
import { BoardNotFound } from '../exception/BoardNotFound';
import { SessionNotFound } from '../exception/SessionNotFound';
import { RegistrationResponse } from "src/model/game/data.response";

const size = 10;

export class DataLayerFacade {
  private _sessionIdCounter: number = 1;

  private _rooms: Room[] = [];

  private _users: User[] = [];

  private _winners: Winner[] = [];

  private _sessions: Session[] = [];

  createUser(id: number, data: RegistrationResponse): User | undefined {
    if (data.name || data.password) {
      const user = { ...data, indexPlayer: id } as User;
      this.addUsers(user);
      this.winners.push({ name: user.name, wins: 0 });
      return user;
    }
  }

  getUserById(id: number): User | undefined {
    return this.users.find((user) => user.indexPlayer === id);
  }

  increaseWin(name: string) {
    const winner = this.winners.find((w) => w.name === name);
    if (winner) {
      winner.wins++;
    }
    return winner;
  }

  getWinners() {
    return this.winners.filter((w) => w.wins > 0);
  }

  createRoom(userId: number): Room {
    const user = this.getUserById(userId);
    if (!user) throw new PlayerNotFound(String(userId));
    const room = { roomId: generateId(), roomUsers: [user] } as Room;
    this.rooms.push(room);
    return room;
  }

  updatesRoom(response: RoomStateUpdateResponse[]): Room[] {
    const rooms: Room[] = [];
    response.forEach((room) => {
      const { roomUsers, roomId } = room;
      roomUsers.forEach((user) => {
        rooms.push(this.updateRoom(user.index, roomId));
      });
    });
    return rooms;
  }

  updateRoom(userId: number, roomId: number): Room {
    const updatedRoom = this.rooms[roomId];
    const user = this.getUserById(userId);
    if (!user || updatedRoom.roomUsers[0].indexPlayer === userId) {
      return this.createRoom(userId);
    }
    updatedRoom.roomUsers.push(user);
    this.rooms.splice(roomId, 1);
    return updatedRoom;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getSession(id: number) {
    return this.sessions.find((game) => game.gameId === id);
  }

  isGameReady(gameId: number): boolean {
    const session: Session | undefined = this.getSession(gameId);

    if (!session || !session.rooms) {
      return false;
    }

    for (const room of session.rooms) {
      if (room.roomUsers.length === 2) {
        return true;
      }
    }
    return false;
  }

  createCells(): Cell[][] {
    const grid: Cell[][] = [];
    for (let x = 0; x < size; x++) {
      const row: Cell[] = [];
      for (let y = 0; y < size; y++) {
        row.push({
          isOccupied: false,
          position: { x, y },
          status: AttackStatus.undefined,
        });
      }
      grid.push(row);
    }
    return grid;
  }

  get rooms(): Room[] {
    return this._rooms;
  }

  get users(): User[] {
    return this._users;
  }

  get winners(): Winner[] {
    return this._winners;
  }

  get sessions(): Session[] {
    return this._sessions;
  }

  increaseSession(): number {
    this._sessionIdCounter++;
    return this._sessionIdCounter;
  }

  private addUsers(user: User) {
    this._users.push(user);
  }

  addShipPositionInBoard(response: AddShipsResponse): AddShipsResponse {
    const { gameId, ships, indexPlayer } = response;
    const session = this.getSession(gameId);

    if (!session) {
      return response;
    }

    const cells: Cell[][] = this.createCells();

    ships.forEach((ship) => {
        const { x, y } = ship.position;
        cells[x][y].isOccupied = true;
    });

    session.ships.push(...ships);

    session.boards.push({
      roomUsers: [],
      cells: [],
      height: 10,
      ships: session.ships,
      width: 10,
    });

    if (this.isGameReady(gameId)) {
      this.startGame(session);
      this.turnShip(gameId);
    }

    return {
      gameId,
      ships,
      indexPlayer,
    };
  }

  turnShip(gameId: number, nextPlayer: boolean = false) {
    const session = this.getSession(gameId);
    if (session) {
      if (nextPlayer) {
        session.indexPlayer = (session.indexPlayer + 1) % session.ships.length;
      }
    }
  }

  getSessionByPlayerId(currentPlayerIndex: number): Session | undefined {
    return this.sessions.find((session) => session.indexPlayer === currentPlayerIndex);
  }

  startGame(session: Session): StartGameResponse {
    const player = this.getUserById(session.indexPlayer);

    if (player) {
      if (session.rooms.length > 0) {
        session.rooms.forEach((room) => room.roomUsers.push(player));
      } else {
        const room = this.createRoom(session.indexPlayer);
        session.rooms.push(room);
        this.addPlayerToGameSession(session, player.indexPlayer);
      }

      if (session.boards.length === 2) {
        return this.runGame(session.gameId);
      }
    }
    return {
      ships: [],
      currentPlayerIndex: session.indexPlayer,
    };
  }

  private runGame(gameId: number): StartGameResponse {
    const session = this.getSession(gameId);
    if (!session) throw new SessionNotFound(String(gameId));
    return {
      ships: session.ships,
      currentPlayerIndex: session.indexPlayer,
    };
  }

  private addPlayerToGameSession(session: Session, playerId: number) {
    session.rooms.forEach((room) => {
      room.roomUsers.forEach((roomUser) => {
        roomUser.indexPlayer = playerId;
      });
    });
  }

  getRandomAttack(userId: number): Position | undefined {
    const session = this.sessions.find((session) => session.indexPlayer === userId);
    if (!session) throw new SessionNotFound('Session not found for the given user ID');
    const board = session.boards.find((board) => board.roomUsers.forEach((roomUser) => roomUser.indexPlayer === userId));
    if (!board) {
      throw new BoardNotFound('Board not found for the given user ID');
    }

    if (this.checkBoardIsNotHit(board.cells)) {
      return;
    }

    const grid = board.cells.flat().filter((cell) => cell.status !== AttackStatus.miss && cell.status !== AttackStatus.killed);

    if (grid.length > 0) {
      return grid[Math.floor(Math.random() * grid.length)].position;
    }
  }

  checkBoardIsNotHit(cells: Cell[][]): boolean {
    return cells.flat().every((cell) => cell.status !== AttackStatus.shot);
  }

  useAttack(position: Position, playerId: number, gameId: number): AttackStatus {
    const session = this.getSession(gameId);
    if (!session) throw new SessionNotFound('Session not found for the given user ID');
    const ship = session.ships.find((ship) => ship.position.x === position.x && ship.position.y === position.y);

    if (!ship) {
      return AttackStatus.miss;
    }
    return AttackStatus.shot;
  }
}
