export class SessionNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Session Not Found Error';
  }
}
