import { Position } from "./position";
import { AttackStatus } from "./attack.status";

export interface AttackResult {
  position: Position;
  status: AttackStatus;
}
