export interface Count{
  value: number;
  playerId: number;
  increment(): void;
  decrement(): void;
}
