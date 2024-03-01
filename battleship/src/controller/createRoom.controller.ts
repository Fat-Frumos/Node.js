import { Room } from '../service/game/room';
import { roomDb, userDb } from '../dao/store';
import { broadcastRoom } from './updateRoom.controller';

export const createRoomController = (id: number) => {
  const room = new Room();
  const user = userDb.get(id);

  if (!user) return;

  if (user.rooms.length > 0) {
    console.log(`Fail: ${user.name} has already created a room`);
    return;
  }

  const { index, name } = user;
  room.addUser({ index, name });
  user.addRoom(room.roomId);

  roomDb.set(room.roomId, room);
  broadcastRoom();
};
