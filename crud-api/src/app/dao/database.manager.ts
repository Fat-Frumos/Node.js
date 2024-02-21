import {DatabaseType} from './database.type';
import {MySQL} from './mysql.database';
import {InMemory} from './inMemory.database';

export class DBManager {
  static connect(databaseType: DatabaseType) {
    switch (databaseType) {
      case DatabaseType.MySQL:
        return new MySQL();
      case DatabaseType.InMemory:
        return new InMemory();
      default:
        throw new InMemory();
    }
  }
}
