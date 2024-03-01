import { getSurroundingCoordinates } from 'src/bot/getSurroundingCoordinates';
import { gameDb, socketDb, userDb } from '../dao/store';
import { AttackResponse } from '../model/game/data.response';
import { turnController } from './turn.controller';
import { broadcastWinners } from './updateWinners.controller';
import { getAttackFeedback } from 'src/bot/getAttackFeedback';
import { AttackStatus } from '../model/ship/attack.status.type';
import { getResponse } from 'src/bot/getResponse';
import { Command } from '../model/game/command.type';

export const attackController = (data: string) => {
  const {
    gameId, position, indexPlayer,
  }: AttackResponse = JSON.parse(data);
  const game = gameDb.get(gameId);

  if (!game || game.turn !== indexPlayer) return;

  const enemyId = game.players.find((playerId) => playerId !== indexPlayer);
  if (!enemyId) return;

  const enemyBoard = game.board.get(enemyId);
  if (!enemyBoard) return;

  const playerShips = game.ships.get(enemyId);
  if (!playerShips) return;

  const ship = playerShips.find((ship) => ship.shipPosition.has(`${x}-${y}`));
  
  const x = position.x;
  const y = position.y;
  
  if (!ship) {
    enemyBoard.set(`${x}-${y}`, true);
    const attackDataFeedbackJson = getAttackFeedback(x, y, indexPlayer, AttackStatus.miss);

    game.players.forEach((playerId) => {
      if (playerId in socketDb) {
        socketDb[playerId].send(attackDataFeedbackJson);
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

      const attackDataFeedbackJson = getAttackFeedback(x, y, indexPlayer, AttackStatus.shot);
      game.players.forEach((playerId) => {
        if (playerId in socketDb) {
          socketDb[playerId].send(attackDataFeedbackJson);
        }
      });

      turnController(indexPlayer, gameId);
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
            socketDb[playerId].send(getAttackFeedback(x, y, indexPlayer, AttackStatus.killed));
          }
        });
      });

      const surroundingCoordinates = getSurroundingCoordinates(shipCoordinates);
      surroundingCoordinates.forEach(([x, y]) => {
        if (x > -1 && y > -1 && x < 10 && y < 10) {
          enemyBoard.set(`${x}-${y}`, true);
        }

        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(getAttackFeedback(x, y, indexPlayer, AttackStatus.miss));
          }
        });
      });

      turnController(indexPlayer, gameId);

      const isWinner = playerShips.every((playerShip) => playerShip.getStatus() === AttackStatus.killed);

      if (isWinner) {
        game.players.forEach((playerId) => {
          if (playerId in socketDb) {
            socketDb[playerId].send(getResponse(Command.finish, JSON.stringify({ winPlayer: indexPlayer })));
            const user = userDb.get(playerId);
            if (!user) return;
            user.clearGame();
          }
        });

        const userWinner = userDb.get(indexPlayer);
        if (!userWinner) return;
        userWinner.wins += 1;
        gameDb.delete(gameId);
        broadcastWinners();
        break;
      }
    }
  }
};
