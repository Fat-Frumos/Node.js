import { AttackDataServer } from '../model/game/data.response';
import { Command } from '../model/game/command.type';
import { AttackStatus } from '../model/ship/attack.status.type';
import { getResponse } from './getResponse';

export const getAttackFeedback = (x: number, y: number, PlayerId: number, status: AttackStatus) => {
  const attackDataFeedback: AttackDataServer = {
    position: { x, y },
    currentPlayer: PlayerId,
    status,
  };

  return getResponse(Command.attack, JSON.stringify(attackDataFeedback));
};
