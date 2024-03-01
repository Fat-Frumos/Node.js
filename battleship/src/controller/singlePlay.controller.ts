import { Game } from '../service/game/game';
import { Room } from '../service/game/room';
import { Ship } from '../service/game/ship';
import {
  gameDb, roomDb, socketDb, userDb,
} from '../dao/store';
import { shipsBot } from 'src/bot/constants';
import { broadcastRoom } from './updateRoom.controller';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';

export const singlePlayController = (id: number) => {
  const room = new Room();
  const userDbById = userDb.get(id);

  if (userDbById) {
    const { index, name } = userDbById;
    room.addUser({ index, name });
    room.addUser({ index: 99999, name: 'bot' });
    roomDb.set(room.roomId, room);
    const newGame = new Game();
    room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
    gameDb.set(newGame.gameId, newGame);
    const user = userDb.get(index);

    if (user) {
      user.rooms.forEach((userRoom) => roomDb.delete(userRoom));
      user.clearRoom();
    }

    const updateGameJson = JSON.stringify({
      idGame: newGame.gameId,
      idPlayer: index,
    });

    socketDb[index].send(getResponse(Command.create_game, updateGameJson));

    const generatedShips: Ship[] = [];
    shipsBot.forEach((ship) => generatedShips.push(new Ship(ship)));

    newGame.addShips(99999, generatedShips);
    newGame.createBoard(99999);

    roomDb.delete(room.roomId);
    broadcastRoom();
  } else {
    console.error('User not found');
  }
};
