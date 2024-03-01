import { Command } from '../model/game/command.type';

export const getResponse = (type: Command, data: string) => JSON.stringify({ type, data, id: 0 });
