declare module 'ws' {
  interface ServerOptions {
  }

  class Server {
    constructor(options: ServerOptions);

    on(event: string, listener: (...args: any[]) => void): this;
  }

  export {
    WebSocket,
    Server,
  };
}
