export class BoardNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Board Not Found';
  }
}
