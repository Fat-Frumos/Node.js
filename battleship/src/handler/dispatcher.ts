import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { DataLayer } from "../dao/data.layer";
import { Player } from "../model/game/player.model";
import { Command } from "../model/game/command.model";
import { Message } from "../model/game/message.model";
import { Position } from "../model/board/position.model";
import { AttackStatus } from "../model/ship/attack.status";

const dao: DataLayer = new DataLayer();

export function updateRoom(data: Message, ws: WebSocket) {
  const game = dao.getSessionById(data.sessionId);
  if (!game) {
    ws.send(JSON.stringify({ type: "error", message: "Game not found" }));
  } else {
    ws.send(JSON.stringify(game));
  }
}

export function createPlayer(): Player { //TODO
  const playerId = dao.players.length + 1;
  return { playerId, username: "", password: "", ships: [] } as Player;
}

export function signUp(data: Message, ws: WebSocket) {
  const player = createPlayer();
  dao.addPlayer(player);
  const response = JSON.stringify({ type: Command.REGISTRATION, data, id: 0 });
  ws.send(response);
}

export function createSession(data: Message, ws: WebSocket) {
  const { playerId } = data;
  const id = dao.createGameSession(playerId);
  const response = JSON.stringify({
    type: Command.CREATE_ROOM,
    data: { id },
    id: 0
  });
  ws.send(response);
}

export function addUserToRoom(data: Message, ws: WebSocket) {
  const { sessionId, playerId } = data;
  const session = dao.getSessionById(sessionId);
  if (session) {
    const player = dao.getPlayerById(playerId);
    if (player) {
      session.players.push(player);
      const response = JSON.stringify({
        type: Command.ADD_USER,
        data: { sessionId: sessionId, playerId },
        id: 0
      });
      ws.send(response);
    } else {
      ws.send(JSON.stringify({
        type: "error",
        message: "Player not found " + playerId
      }));
    }
  } else {
    ws.send(JSON.stringify({
      type: "error",
      message: "Room not found " + sessionId
    }));
  }
}

export function startGame(data: Message, ws: WebSocket) {
  const sessionId: number = generateSessionId();
  const player = dao.getPlayerById(data.playerId);
  if (!player) {
    console.log("Player not found");
    return;
  }
  
  const session = dao.getSessionById(sessionId);
  
  if (session) {
    session.players.push(player);
    const currentPlayerIndex: number = 0;
    const shipsPositions: Position[] = [];
    
    const eventData = {
      ships: shipsPositions,
      currentPlayerIndex
    };
    session.players.forEach(player => {
      sendMessageToPlayer(player.playerId, "start_game", eventData);
    });
  } else {
    dao.createGameSession(sessionId);
    dao.addPlayerToGameSession(sessionId, player);
  }
  
  if (session && session.players.length === 2) {
    runGame(sessionId);
  }
  ws.send(JSON.stringify(session)); //TODO startGame
}

export function userAttack(data: Message, ws: WebSocket) {
  const { position, playerId } = data;
  const status: AttackStatus = dao.getAttackStatus(position, playerId);
  const result = {
    type: "attack_result",
    data: { position, status }
  };
  ws.send(JSON.stringify(result));
}

export function addShipToBoard(data: Message, ws: WebSocket) {
  const { position, playerId } = data;
  const occupied = dao.checkPositionInBoard(position, playerId);
  const confirmation = { type: "ship_added", data: { success: !occupied } };
  const payload = JSON.stringify(confirmation);
  ws.send(payload);
}

export function randomAttack(data: Message, ws: WebSocket) {
  const { position, playerId } = data;
  const status: AttackStatus = dao.getAttackStatus(position, playerId);
  const aim: Position = dao.getRandomAttack();
  const result = {
    type: "attack_result",
    data: { position, status, aim }
  };
  const payload = JSON.stringify(result);
  ws.send(payload);
}

function generateSessionId(): number {
  return Number(uuidv4());
}


function runGame(gameId: number) {

}

function sendMessageToPlayer(playerId: number, type: string, data: any) {

}

export function addBot(data: Message, ws: WebSocket) {

}

export function finishGame(data: Message, ws: WebSocket) {

}
