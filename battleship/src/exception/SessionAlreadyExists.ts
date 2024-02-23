export class SessionAlreadyExists extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Session Already Exists Error';
  }
}
