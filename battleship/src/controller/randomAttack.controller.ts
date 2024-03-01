import { getSurroundingCoordinates } from 'src/bot/getSurroundingCoordinates';
import { gameDb, socketDb, userDb } from '../dao/store';
import { RandomAttackDataClient } from '../model/game/data.response';
import { turnController } from './turn.controller';
import { broadcastWinners } from './updateWinners.controller';
import { getAttackFeedback } from 'src/bot/getAttackFeedback';
import { AttackStatus } from '../model/ship/attack.status.type';
import { getResponse } from 'src/bot/getResponse';
import { Command } from '../model/game/command.type';

function generateCoordinates(board: Map<string, boolean>) {
  const matrixSize = 10;

  for (let x = 0; x < matrixSize; x++) {
    for (let y = 0; y < matrixSize; y++) {
      if (board.get(`${x}-${y}`) === false) {
        return { x, y };
      }
    }
  }
}

export const randomAttackController = (data: string) => {
  const { gameId, index }: RandomAttackDataClient = JSON.parse(data);
  const game = gameDb.get(gameId);
  if (!game) return;
  const enemyId = game.players.find((playerId) => playerId !== index);
  if (!enemyId) return;
  const enemyBoard = game.board.get(enemyId);
  if (!enemyBoard) return;
  const coordinates = generateCoordinates(enemyBoard);
  if (!coordinates) return;
  const { x, y } = coordinates;
  const playerShips = game.ships.get(enemyId);
  if (!playerShips) return;
  const ship = playerShips.find((ship) => ship.shipPosition.has(`${x}-${y}`));

  if (!ship) {
    enemyBoard.set(`${x}-${y}`, true);
    game.players.forEach((playerId) => {
      if (playerId in socketDb) {
        socketDb[playerId].send(getAttackFeedback(x, y, index, AttackStatus.miss));
      }
    });

    game.turn = enemyId;
    turnController(game.turn, gameId);
    return;
  }

  ship.shipPosition.set(`${x}-${y}`, true);
  const shipIndex = playerShips.findIndex((ship) => ship.shipPosition.has(`${x}-${y}`));
  playerShips[shipIndex] = ship;
  const status: AttackStatus = ship.getStatus();

  switch (status) {
    case AttackStatus.shot: {
      enemyBoard.set(`${x}-${y}`, true);
      game.players.forEach((playerId) => {
        if (playerId in socketDb) {
          socketDb[playerId].send(getAttackFeedback(x, y, index, AttackStatus.shot));
        }
      });

      turnController(index, gameId);
      break;
    }

    case AttackStatus.killed: {
      const shipCoordinates: number[][] = [];

      ship.shipPosition.forEach((_, key) => {
        const coordinates = key.split('-').map(Number);
        shipCoordinates.push(coordinates);
        const [x, y] = coordinates;
        enemyBoard.set(`${x}-${y}`, true);

        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(getAttackFeedback(x, y, index, AttackStatus.killed));
          }
        });
      });

      getSurroundingCoordinates(shipCoordinates).forEach(([x, y]) => {
        if (x > -1 && y > -1 && x < 10 && y < 10) {
          enemyBoard.set(`${x}-${y}`, true);
        }

        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(getAttackFeedback(x, y, index, AttackStatus.miss));
          }
        });
      });

      turnController(index, gameId);

      const isWinner = playerShips.every((playerShip) => playerShip.getStatus() === AttackStatus.killed);

      if (isWinner) {
        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(getResponse(Command.finish, JSON.stringify({ winPlayer: index })));
            const user = userDb.get(playerId);
            if (!user) return;
            user.clearGame();
          }
        });

        if (index !== 99999) {
          const userWinner = userDb.get(index);
          if (!userWinner) return;
          userWinner.wins += 1;
          gameDb.delete(gameId);
        }
        broadcastWinners();
        break;
      }
    }
  }
};
