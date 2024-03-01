import { Ship } from '../service/game/ship';
import { gameDb, socketDb } from '../dao/store';
import { AddShipsDataClient } from '../model/game/data.response';
import { turnController } from './turn.controller';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';

export const addShipsController = (data: string) => {
  const { gameId, ships, indexPlayer }: AddShipsDataClient = JSON.parse(data);

  const generatedShips: Ship[] = [];
  ships.forEach((ship) => generatedShips.push(new Ship(ship)));

  const game = gameDb.get(gameId);
  if (!game) return;
  game.addShips(indexPlayer, generatedShips);
  game.createBoard(indexPlayer);

  if (game.ships.size === 2) {
    const { players } = game;

    players.forEach((playerId) => {
      const playerShips = game.ships.get(playerId);
      if (!playerShips) return;
      const ships = playerShips.map(({
        position, direction, length, type,
      }) => ({
        position, direction, length, type,
      }));

      const shipsDataAnswer = { gameId, ships, currentPlayerIndex: playerId };

      if (playerId in socketDb) {
        socketDb[playerId].send(getResponse(Command.start_game, JSON.stringify(shipsDataAnswer)));
      }
    });

    game.turn = players[0];
    turnController(game.turn, gameId);
  }
};
