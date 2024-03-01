import { GameBoard } from './GameBoard';
import { Session } from "src/model/game/session.model";
import { Room } from "src/model/room/room.model";

export class GameSessions {
  private static instance: GameSessions;

  private readonly gameSessions: Map<number, Session>;

  private constructor() {
    this.gameSessions = new Map<number, Session>();
  }

  public static getInstance(): GameSessions {
    if (!GameSessions.instance) {
      GameSessions.instance = new GameSessions();
    }
    return GameSessions.instance;
  }

  public getGameSession(sessionId: number): Session | undefined {
    return this.gameSessions.get(sessionId);
  }

  public createGameSession(sessionId: number, rooms: Room[]): Session {
    if (!this.gameSessions.has(sessionId)) {
      const session: Session = {
        gameId: sessionId,
        rooms,
        indexPlayer: 0,
        boards: [],
        ships: [],
      };
      this.addGameSession(session);
      return session;
    }
    return this.gameSessions.get(sessionId)!;
  }

  // public addPlayerToGameSession(gameId: number, player: Player): Session {
  //   const session = this.gameSessions.get(gameId);
  //   if (session) {
  //     session.players.push(player);
  //     return session;
  //   } else {
  //     return this.createGameSession(player.playerId, [player], new GameBoard(10));
  //   }
  // }

  public removeGameSession(gameId: number): void {
    this.gameSessions.delete(gameId);
  }

  addGameSession(session: Session): void {
    this.gameSessions.set(session.gameId, session);
    console.log('str'.indexOf('o'));
  }

  getBoardByPlayerId(playerId: number): GameBoard { // TODO
    const board = {} as GameBoard;
    this.gameSessions.forEach((session) => {
      session.rooms.forEach((player) => {
        if (player.id === playerId) {
          board.roomUsers = player.roomUsers;
        }
      });
    });
    return board;
  }
}
