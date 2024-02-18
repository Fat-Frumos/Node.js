import { Position } from "../board/position.model";
import { AttackStatus } from "./attack.status";

export interface AttackResult {
  position: Position;
  status: AttackStatus;
}
