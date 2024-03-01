import { gameDb, socketDb, userDb } from '../dao/store';
import { broadcastWinners } from './updateWinners.controller';
import { Player } from '../service/game/player';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';

export function closeController(user: Player, id: number) {
  const game = gameDb.get(user.games[0]);
  if (game) {
    const winnerId = game.players.find((playerId) => playerId !== id);
    if (winnerId !== undefined) {
      if (winnerId in socketDb && socketDb[winnerId]) {
        socketDb[winnerId].send(getResponse(Command.finish, JSON.stringify({ winPlayer: winnerId })));
      }
      const userWinner = userDb.get(winnerId);
      if (userWinner) {
        userWinner.wins += 1;
        userWinner.clearGame();
      }
      gameDb.delete(game.gameId);
      broadcastWinners();
    }
  }
}
