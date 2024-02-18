import { Board } from "./Board";
import { Player } from "../../model/game/player.model";
import { Session } from "../../model/game/session.model";
import { Position } from "../../model/board/position.model";

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
  
  public createGameSession(sessionId: number, players: Player[], board: Board): Session {
    if (!this.gameSessions.has(sessionId)) {
      const session: Session = {
        sessionId: sessionId,
        players: players,
        board: board
      };
      this.gameSessions.set(sessionId, session);
      return session;
    } else {
      return this.gameSessions.get(sessionId)!;
    }
  }
  
  public addPlayerToGameSession(gameId: number, player: Player): Session {
    const session = this.gameSessions.get(gameId);
    if (session) {
      session.players.push(player);
      return session;
    } else {
      return this.createGameSession(player.playerId, [player], new Board(10));
    }
  }
  
  public removeGameSession(gameId: number): void {
    this.gameSessions.delete(gameId);
  }
  
  addGameSession(session: Session): void {
    this.gameSessions.set(session.sessionId, session);
  }
  
  checkBoard(position: Position, playerId: number): boolean {
    const border = this.getBorderByPlayerId(playerId);
    return position.x >= 0 && position.x < border.size && position.y >= 0 && position.y < border.size;
  }
  private getBorderByPlayerId(playerId: number): Board {
    let board = {} as Board;
    
    this.gameSessions.forEach(session => {
      session.players.forEach(player => {
        if (player.playerId === playerId) {
          board = session.board;
        }
      });
    });
    return board;
  }
    
    createPlayer(playerId: number): Player {
    return {
      playerId: playerId,
      ships: [],
      username: "",
      password: ""
    };
  }
}
