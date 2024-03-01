import { WebSocketServer } from 'ws';
import { generateUserId } from 'src/bot/generateUserId';
import { RequestType } from './model/game/types';
import {
  roomDb,
  socketDb,
  userDb,
  WebSocketWithDispatchEvent,
} from './dao/store';
import { signupController } from './controller/signupController';
import { addUserToRoomController } from './controller/addUserToRoom.controller';
import { createRoomController } from './controller/createRoom.controller';
import { addShipsController } from './controller/addShips.controller';
import { attackController } from './controller/attack.controller';
import { randomAttackController } from './controller/randomAttack.controller';
import { singlePlayController } from './controller/singlePlay.controller';
import { broadcastWinners } from './controller/updateWinners.controller';
import { broadcastRoom } from './controller/updateRoom.controller';
import { closeController } from './controller/close.controller';
import { Command } from './model/game/command.type';

const serverInfo = 'This WebSocket server is running on ws://localhost:3000';

const wss: WebSocketServer = new WebSocketServer({ port: 3000 });
console.log(serverInfo);

wss.on('connection', (ws) => {
  const id = generateUserId();
  console.log(`User with id: ${id} is connected`);

  ws.on('message', (message: string) => {
    const { type, data }: RequestType = JSON.parse(message);
    console.log(`Received: [${type}] request`);

    socketDb[id] = ws as unknown as WebSocketWithDispatchEvent;

    switch (type) {
      case Command.reg: {
        signupController(id, data);
        break;
      }

      case Command.create_game: {
        createRoomController(id);
        break;
      }

      case Command.add_user_to_room: {
        addUserToRoomController(id, data);
        break;
      }

      case Command.add_ships: {
        addShipsController(data);
        break;
      }

      case Command.attack: {
        attackController(data);
        break;
      }

      case Command.randomAttack: {
        randomAttackController(data);
        break;
      }

      case Command.single: {
        singlePlayController(id);
        break;
      }
    }
  });

  ws.on('close', () => {
    console.log(`Connection id: ${id} is closed`);
    const user = userDb.get(id);
    user?.rooms?.[0] && roomDb.delete(user.rooms[0]);
    broadcastRoom();
    if (!user) return;
    if (user.games.length > 0) closeController(user, id);
    userDb.delete(id);
    broadcastWinners();
    ws.close();
  });
});
