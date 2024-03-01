export class PlayerNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Player Not Found Error';
  }
}
