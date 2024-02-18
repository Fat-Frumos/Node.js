import { Player } from "../model/game/player.model";
import { Session } from "../model/game/session.model";
import { GameSessions } from "../service/session/GameSessions";
import { Board } from "../service/session/Board";
import { AttackStatus } from "../model/ship/attack.status";
import { Position } from "../model/board/position.model";

export class DataLayer {
  
  sessionIdCounter: number = 1;
  private _players: Player[] = [];
  private rooms: GameSessions = GameSessions.getInstance();
  
  addPlayer(player: Player): void {
    this._players.push(player);
  }
  
  get players(): Player[] {
    return this._players;
  }
  
  increaseSession(): number {
    this.sessionIdCounter++;
    return this.sessionIdCounter;
  }
  
  getSessionById(sessionId: number): Session | undefined {
    return this.rooms.getGameSession(sessionId);
  }
  
  getPlayerById(playerId: number): Player | undefined {
    return this.players.find(player => player.playerId === playerId);
  }
  
  addPlayerToGameSession(sessionId: number, player: Player): void {
    this.rooms.addPlayerToGameSession(sessionId, player);
  }
  
  createGameSession(playerId: number): number {
    const sessionId = this.increaseSession();
    const player = this.getPlayerById(playerId);
    
    if (player) {
      
      if (this.players.length < 2) {
        this.rooms.addPlayerToGameSession(sessionId, player);
      } else {
        this.addPlayer(this.rooms.createPlayer(playerId));
        const board: Board = new Board(10);
        this.rooms.createGameSession(sessionId, this.players, board);
      }
    }
    return sessionId;
  }
  
  getAttackStatus(position: Position, playerId: number): AttackStatus {
    const hit: boolean = this.rooms.checkBoard(position, playerId);
    return hit ? AttackStatus.HIT : AttackStatus.MISS;  //TODO AttackStatus.KILL
  }
  
  checkPositionInBoard(position: Position, playerId: number): boolean {
    return this.rooms.checkBoard(position, playerId);
  }
  
  getRandomAttack(): Position {
    return {x: 0, y: 0};//TODO check board, generate random shot
  }
}
