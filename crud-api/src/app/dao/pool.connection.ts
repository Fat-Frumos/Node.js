import mysql from 'mysql2';

export class ConnectionPool {
  private pool!: mysql.Pool;
  
  constructor() {
    this.initializePool();
  }
  
  private initializePool() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'sql.freedb.tech',
      port: 3306,
      user: 'freedb_client_db',
      password: '8zMA@sKsgS@Bb5s',
      database: 'freedb_chinook',
      authPlugins: {
        mysql_clear_password: () => () => Buffer.from('8zMA@sKsgS@Bb5s')
      }
    });
  }
  
  public async getConnection(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      if (!this.pool) {
        reject(new Error('Connection pool has not been initialized'));
      } else {
        this.pool.getConnection((error, connection) => {
          if (error) {
            reject(error);
          } else {
            resolve(connection);
          }
        });
      }
    });
  }
}
