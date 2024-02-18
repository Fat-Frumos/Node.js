import { Count } from "../../model/game/count.model";

export class Counter implements Count{
  private _value: number;
  private _playerId: number;
  
  constructor(playerId: number) {
    this._value = 0;
    this._playerId = playerId;
  }
  
  get playerId(): number {
    return this._playerId;
  }
  
  set playerId(value: number) {
    this._playerId = value;
  }
  
  get value(): number {
    return this._value;
  }
  
  increment(): void {
    this._value++;
  }
  
  decrement(): void {
    this._value--;
  }
}
