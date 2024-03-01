import { socketDb, userDb } from '../dao/store';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';
import { Winner } from '../model/game/winner.model';

export const broadcastWinners = () => {
  const users = Array.from(userDb.values());
  const winners: Winner[] = users.filter((user) => user.wins > 0).map(({ name, wins }) => ({ name, wins }));
  Object.keys(socketDb).forEach((id) => {
    socketDb[id].send(getResponse(Command.update_winners, JSON.stringify(winners)));
  });
};
