import {Hobby, User} from 'app/model/user.model';
import {DatabaseModel} from './database.model';

export class InMemory implements DatabaseModel {
  private users: User[] = [];
  private hobbies: Hobby[] = [];
  
  getUserById(id: string): User | null {
    return this.users.find(user => user.id === id) ?? null;
  }
  
  getAllUsers(): User[] {
    return this.users;
  }
  
  createUser(user: User): User {
    this.users.push(user);
    return user;
  }
  
  updateUser(id: string, user: User): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = user;
      return user;
    }
    return null;
  }
  
  deleteUser(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
  
  getAllHobbies(): Hobby[] {
    return this.hobbies;
  }
  
  getHobbyById(id: string): Hobby | null {
    return this.hobbies.find(hobby => hobby.id === id) ?? null;
  }
  
  createHobby(hobby: Hobby): Hobby {
    this.hobbies.push(hobby);
    return hobby;
  }
  
  getHobbiesByUserId(userId: string): Hobby[] {
    return this.hobbies.filter(hobby => hobby.userId === userId);
  }
}
