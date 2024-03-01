import { roomDb, socketDb } from '../dao/store';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';

export const broadcastRoom = () => {
  Object.keys(socketDb).forEach((id) => {
    socketDb[id].send(getResponse(
      Command.update_room,
      JSON.stringify(Array.from(roomDb.values())),
    ));
  });
};
