import { Player } from '../service/game/player';
import { socketDb, userDb } from '../dao/store';
import { RegistrationResponse, PlayerRegistrationResponse } from '../model/game/data.response';
import { broadcastRoom } from './updateRoom.controller';
import { broadcastWinners } from './updateWinners.controller';
import { Command } from '../model/game/command.type';
import { getResponse } from 'src/bot/getResponse';

export const signupController = (id: number, data: string) => {
  const { name, password }: RegistrationResponse = JSON.parse(data);
  const newUser = new Player(id, name, password);
  userDb.set(id, newUser);

  const isUsernameExist = Array.from(userDb.values()).some((user) => user.name === name);

  const userData: PlayerRegistrationResponse = {
    name: newUser.name,
    index: newUser.index,
    error: isUsernameExist,
    errorText: isUsernameExist ? 'This username is already logged in' : '',
  };

  socketDb[id].send(getResponse(Command.reg, JSON.stringify(userData)));
  !isUsernameExist && broadcastRoom();
  !isUsernameExist && broadcastWinners();
};
