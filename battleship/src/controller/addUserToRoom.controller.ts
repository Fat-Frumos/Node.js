import { Game } from '../service/game/game';
import {
  gameDb, roomDb, socketDb, userDb,
} from '../dao/store';
import { AddUserToRoomDataClient } from '../model/game/data.response';
import { broadcastRoom } from './updateRoom.controller';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';

export const addUserToRoomController = (id: number, data: string) => {
  const { indexRoom }: AddUserToRoomDataClient = JSON.parse(data);
  const room = roomDb.get(indexRoom);
  if (!room) return;
  const userById = userDb.get(id);
  if (!userById) return;
  const { index, name } = userById;
  const isUserInRoom = room.roomUsers.find((user) => user.index === id);
  if (isUserInRoom) {
    console.log('Fail: The user is already in the Room');
    return;
  }

  room.addUser({ index, name });

  const newGame = new Game();
  room.roomUsers.forEach(({ index }) => newGame.addPlayer(index));
  gameDb.set(newGame.gameId, newGame);

  room.roomUsers.forEach(({ index }) => {
    const user = userDb.get(index);
    if (!user) return;
    user.addGame(newGame.gameId);

    const updateGameJson = JSON.stringify({
      idGame: newGame.gameId,
      idPlayer: index,
    });
    const updateGameAnswer = getResponse(Command.create_game, updateGameJson);
    const socket = socketDb[index];
    socket.send(updateGameAnswer);
  });

  roomDb.delete(indexRoom);
  room.roomUsers.forEach(({ index }) => {
    const user = userDb.get(index);
    if (!user) return;
    user.rooms.forEach((userRoom) => roomDb.delete(userRoom));
    user.clearRoom();
  });
  broadcastRoom();
};
