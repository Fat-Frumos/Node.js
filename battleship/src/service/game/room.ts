import { RoomUser } from 'src/model/room/room.user.model';

export class Room {
  private static lastId = 0;

  public roomId: number;

  constructor(public roomUsers: RoomUser[] = []) {
    this.roomId = Room.generateNextId();
  }

  addUser(user: RoomUser) {
    this.roomUsers.push(user);
  }

  private static generateNextId = () => {
    this.lastId += 1;
    return this.lastId;
  };
}
