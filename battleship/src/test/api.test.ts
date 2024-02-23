import WebSocket from "ws";
import { eventListener } from "../handler/factory";

let player1Socket: WebSocket;
let player2Socket: WebSocket;
let wss: WebSocket.Server;
let ws: WebSocket;

beforeAll(() => {
  wss = new WebSocket.Server({ port: 3000 });
  wss.on("connection", (client) => {
    client.on("message", (message) => {
      eventListener(message.toString());
    });
  });
});

beforeEach((done) => {
  ws = new WebSocket("ws://localhost:3000");
  ws.on("open", done);
});

afterAll(() => {
  wss.close();
});

afterEach(() => {
  ws.close();
});

describe("WebSocket Event Listener", () => {
  
  it("should receive a response for registering a new player", (done) => {
    ws.send(JSON.stringify({
      type: "register",
      data: { name: "user", password: "password" }
    }));
    
    ws.on("message", (message) => {
      const response = JSON.parse(message.toString());
      expect(response).toHaveProperty("userId");
      done();
    });
  });
});

describe("Game Room Management", () => {
  let authToken: string;
  
  beforeAll((done) => {
    ws.on('open', () => {
      ws.send(JSON.stringify({
        type: 'login',
        data: { name: 'user', password: 'password' }
      }));
    });
    
    ws.on('message', (message) => {
      const response = JSON.parse(message.toString());
      if (response.type === 'login') {
        authToken = response.data.token;
        done();
      }
    });
  });
  
  it("should create a new game room", (done) => {
    ws.send(JSON.stringify({
      type: 'create-room',
      authToken
    }));
    
    ws.on('message', (message) => {
      const response = JSON.parse(message.toString());
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("roomId");
      done();
    });
  });
  
  it("should add ships to the game board", (done) => {
    ws.send(JSON.stringify({
      type: 'add-ships',
      authToken,
      data: {
        ships: [
          { type: "small", position: { x: 1, y: 1 }, direction: true }
        ]
      }
    }));
    
    ws.on('message', (message) => {
      const response = JSON.parse(message.toString());
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      done();
    });
  });
});

describe("Gameplay", () => {
  let ws: WebSocket;
  let authToken: string;
  
  beforeAll(async () => {
    ws = new WebSocket('ws://localhost:3000');
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'login', data: { name: 'user', password: 'password' } }));
    });
    
    ws.on('message', (message) => {
      const response = JSON.parse(message.toString());
      if (response.type === 'login') {
        authToken = response.data.token;
      }
    });
  });
  
  it("should allow a player to attack", (done) => {
    ws.send(JSON.stringify({
      type: 'attack',
      authToken,
      data: { x: 1, y: 1 }
    }));
    
    ws.on('message', (message) => {
      const response = JSON.parse(message.toString());
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("result");
      done();
    });
  });
});

describe("WebSocket Command Tests", () => {
  
  it("should create a new game room", (done) => {
    const createRoomMessage = JSON.stringify({
      type: "create_room",
      data: "",
      id: 0,
    });
    
    ws.on("open", () => {
      ws.send(createRoomMessage);
    });
    
    ws.on("message", (message) => {
      const response = JSON.parse(message.toString());
      expect(response.type).toBe("create_room");
      done();
    });
  });
  
  it("should add a user to a room", (done) => {
    const addUserToRoomMessage = JSON.stringify({
      type: "add_user_to_room",
      data: {
        indexRoom: 123,
      },
      id: 0,
    });
    
    ws.on("open", () => {
      ws.send(addUserToRoomMessage);
    });
    
    ws.on("message", (message) => {
      const response = JSON.parse(message.toString());
      expect(response.type).toBe("create_game");
      done();
    });
  });
  
  it("should update room state", (done) => {
    const updateRoomStateMessage = JSON.stringify({
      type: "update_room",
      data: [
        {
          roomId: 123,
          roomUsers: [
            { name: "Player1", index: 1 },
            { name: "Player2", index: 2 },
          ],
        },
      ],
      id: 0,
    });
    
    ws.on("open", () => {
      ws.send(updateRoomStateMessage);
    });
    
    ws.on("message", (message) => {
      const response = JSON.parse(message.toString());
      expect(response.type).toBe("update_room");
      done();
    });
  });
  
  it("should add ships to the game board", (done) => {
    const addShipsMessage = JSON.stringify({
      type: "add_ships",
      data: {
        gameId: 123,
        ships: [
          {
            position: { x: 1, y: 1 },
            direction: true,
            length: 3,
            type: "small",
          },
        ],
        indexPlayer: 1,
      },
      id: 0,
    });
    
    ws.on("open", () => {
      ws.send(addShipsMessage);
    });
    
    ws.on("message", (message) => {
      const response = JSON.parse(message.toString());
      expect(response.type).toBe("start_game");
      done();
    });
  });
});

describe('WebSocket API Test Cases', () => {
  
  beforeAll((done) => {
    wss = new WebSocket.Server({ port: 3000 });
    
    wss.on('listening', () => {
      player1Socket = new WebSocket('ws://localhost:3000');
      player2Socket = new WebSocket('ws://localhost:3000');
      
      player1Socket.on('open', () => {
        player2Socket.on('open', () => {
          done();
        });
      });
    });
    
    wss.on('connection', (socket) => {
      socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString());
        switch (parsedMessage.type) {
          case 'reg':
            socket.send(JSON.stringify({
              type: 'reg',
              data: {
                name: parsedMessage.data.name,
                index: 1,
                error: false,
                errorText: '',
              },
              id: 0,
            }));
            break;
          case 'create_room':
            socket.send(JSON.stringify({
              type: 'create_game',
              data: {
                idGame: 123,
                idPlayer: 1,
              },
              id: 0,
            }));
            break;
          default:
            break;
        }
      });
    });
  });
  
  afterAll(() => {
    wss.close();
    player1Socket.close();
    player2Socket.close();
  });
  
  test('Player Registration and Room Creation', (done) => {
    const regMsgPlayer1 = JSON.stringify({
      type: 'reg',
      data: {
        name: 'Player1',
        password: 'password1',
      },
      id: 0,
    });
    
    const createRoomMsgPlayer1 = JSON.stringify({
      type: 'create_room',
      data: '',
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('create_game');
      done();
    });
    
    player1Socket.send(regMsgPlayer1);
    player1Socket.send(createRoomMsgPlayer1);
  });
  
  
});


describe('WebSocket API Test Cases Game', () => {
  
  beforeAll((done) => {
    wss = new WebSocket.Server({ port: 3000 });
    
    wss.on('listening', () => {
      player1Socket = new WebSocket('ws://localhost:3000');
      player2Socket = new WebSocket('ws://localhost:3000');
      
      player1Socket.on('open', () => {
        player2Socket.on('open', () => {
          done();
        });
      });
    });
    
    wss.on('connection', (socket) => {
      socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString());
        switch (parsedMessage.type) {
          case 'attack':
            socket.send(JSON.stringify({
              type: 'attack',
              data: {
                position: {
                  x: parsedMessage.data.x,
                  y: parsedMessage.data.y,
                },
                currentPlayer: parsedMessage.data.indexPlayer,
                status: 'miss',
              },
              id: 0,
            }));
            break;
          case 'randomAttack':
            socket.send(JSON.stringify({
              type: 'attack',
              data: {
                position: {
                  x: Math.floor(Math.random() * 10),
                  y: Math.floor(Math.random() * 10),
                },
                currentPlayer: parsedMessage.data.indexPlayer,
                status: 'miss',
              },
              id: 0,
            }));
            break;
          default:
            break;
        }
      });
    });
  });
  
  afterAll(() => {
    wss.close();
    player1Socket.close();
    player2Socket.close();
  });
  
  test('Attack Feedback', (done) => {
    const attackMsg = JSON.stringify({
      type: 'attack',
      data: {
        gameId: 123,
        x: 3,
        y: 5,
        indexPlayer: 1,
      },
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('attack');
      expect(parsedMessage.data.status).toBe('miss');
      done();
    });
    
    player1Socket.send(attackMsg);
  });
  
  test("Random Attack", (done) => {
    const randomAttackMsg = JSON.stringify({
      type: "randomAttack",
      data: {
        gameId: 123,
        indexPlayer: 2
      },
      id: 0
    });
    player2Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('attack');
      expect(parsedMessage.data.status).toBe('miss');
      done();
    });
    
    player2Socket.send(randomAttackMsg);
  });
  
  test('Info about Player Turn', (done) => {
    const turnInfoMsg = JSON.stringify({
      type: 'turn',
      data: {
        currentPlayer: 1,
      },
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('turn');
      expect(parsedMessage.data.currentPlayer).toBe(1);
      done();
    });
    
    player2Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('turn');
      expect(parsedMessage.data.currentPlayer).toBe(1);
      done();
    });
    
    player1Socket.send(turnInfoMsg);
  });
  
  test('Finish Game', (done) => {
    const finishGameMsg = JSON.stringify({
      type: 'finish',
      data: {
        winPlayer: 1,
      },
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('finish');
      expect(parsedMessage.data.winPlayer).toBe(1);
      done();
    });
    
    player2Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('finish');
      expect(parsedMessage.data.winPlayer).toBe(1);
      done();
    });
    
    player1Socket.send(finishGameMsg);
  });
  
  test('Create New Room', (done) => {
    const createRoomMsg = JSON.stringify({
      type: 'create_room',
      data: '',
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('create_game');
      done();
    });
    
    player1Socket.send(createRoomMsg);
  });
  
  test('Add User to Room and Create Game', (done) => {
    const addUserToRoomMsg = JSON.stringify({
      type: 'add_user_to_room',
      data: {
        indexRoom: 1,
      },
      id: 0,
    });
    
    player2Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('create_game');
      done();
    });
    
    player2Socket.send(addUserToRoomMsg);
  });
  
  test('Update Room State', (done) => {
    const updateRoomStateMsg = JSON.stringify({
      type: 'update_room',
      data: [
        {
          roomId: 1,
          roomUsers: [
            {
              name: 'Player1',
              index: 1,
            },
          ],
        },
      ],
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('update_room');
      done();
    });
    
    player1Socket.send(updateRoomStateMsg);
  });
  
  test('Add Ships to the Game Board', (done) => {
    const addShipsMsg = JSON.stringify({
      type: 'add_ships',
      data: {
        gameId: 123,
        ships: [
          {
            position: { x: 3, y: 4 },
            direction: true,
            length: 3,
            type: 'medium',
          },
        ],
        indexPlayer: 1,
      },
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('start_game');
      done();
    });
    
    player1Socket.send(addShipsMsg);
  });
  
  test('Start Game', (done) => {
    const startGameMsg = JSON.stringify({
      type: 'start_game',
      data: {
        ships: [
          {
            position: { x: 5, y: 6 },
            direction: false,
            length: 2,
            type: 'small',
          },
        ],
        currentPlayerIndex: 2,
      },
      id: 0,
    });
    
    player2Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('start_game');
      done();
    });
    
    player2Socket.send(startGameMsg);
  });
  
  test('Login or Create Player', (done) => {
    const playerRegMsg = JSON.stringify({
      type: 'reg',
      data: {
        name: 'Player',
        password: 'password',
      },
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('reg');
      expect(parsedMessage.data.name).toBe('TestPlayer');
      expect(parsedMessage.data.index).toBeDefined();
      expect(parsedMessage.data.error).toBe(false);
      done();
    });
    
    player1Socket.send(playerRegMsg);
  });
  
  test('Update Winners', (done) => {
    const updateWinnersMsg = JSON.stringify({
      type: 'update_winners',
      data: [
        {
          name: 'Player1',
          wins: 5,
        },
        {
          name: 'Player2',
          wins: 3,
        },
      ],
      id: 0,
    });
    
    player1Socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      expect(parsedMessage.type).toBe('update_winners');
      expect(parsedMessage.data.length).toBe(2);
      done();
    });
    
    player1Socket.send(updateWinnersMsg);
  });
});
