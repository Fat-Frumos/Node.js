import { Ship } from 'src/service/game/ship';

const matrixSize = 10;

export class Game {
  private static lastId = 0;

  public turn: number;

  public gameId: number;

  public players: number[];

  public ships: Map<number, Ship[]>;

  public board: Map<number, Map<string, boolean>>;

  constructor() {
    this.turn = 0;
    this.players = [];
    this.ships = new Map();
    this.board = new Map();
    this.gameId = Game.generateNextId();
  }

  private static generateNextId = () => {
    this.lastId += 1;
    return this.lastId;
  };

  addPlayer = (playerId: number) => {
    this.players.push(playerId);
  };

  addShips = (playerId: number, ships: Ship[]) => {
    this.ships.set(playerId, ships);
  };

  public createBoard(playerId: number) {
    const matrixMap = new Map();

    for (let x = 0; x < matrixSize; x++) {
      for (let y = 0; y < matrixSize; y++) {
        matrixMap.set(`${x}-${y}`, false);
      }
    }

    this.board.set(playerId, matrixMap);
  }
}
