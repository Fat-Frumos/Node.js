import {User} from 'app/model/user.model';

export class InMemoryDB {
  private users: { [id: string]: User } = {};
  
  public findUserById(id: string): User | undefined {
    return this.users[id];
  }
  
  public findAllUsers(): User[] {
    return Object.values(this.users);
  }
  
  public createUser(user: User): User {
    this.users[user.id] = user;
    return user;
  }
  
  public updateUser(id: string, user: User): User | undefined {
    if (this.users[id]) {
      this.users[id] = user;
      return user;
    }
    return undefined;
  }
  
  public deleteUser(id: string): boolean {
    if (this.users[id]) {
      delete this.users[id];
      return true;
    }
    return false;
  }
}
