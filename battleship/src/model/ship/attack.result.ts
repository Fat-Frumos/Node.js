import { Position } from "../board/position.model";
import { AttackStatus } from "./attack.status.type";

export interface AttackResult {
  position: Position;
  status: AttackStatus;
}
