import { gameDb, socketDb } from '../dao/store';
import { RandomAttackDataClient } from '../model/game/data.response';
import { randomAttackController } from './randomAttack.controller';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';

export const turnController = (playerId: number, gameId: number) => {
  const game = gameDb.get(gameId);
  if (!game) return;

  game.players.forEach((playerId) => {
    if (playerId in socketDb) {
      socketDb[playerId].send(getResponse(Command.turn, JSON.stringify({ currentPlayer: playerId })));
    }
  });
  if (playerId === 99999) {
    const data: RandomAttackDataClient = {
      gameId: game.gameId,
      index: playerId,
    };
    randomAttackController(JSON.stringify(data));
  }
};
