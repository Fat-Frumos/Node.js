export class PlayerAlreadyExists extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Player Already Exists Error';
  }
}
