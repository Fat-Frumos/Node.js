import {Hobby, User} from '../model/user.model';

export interface DatabaseModel {
  
  getUserById(id: string): User | null;
  
  getAllUsers(): User[];
  
  createUser(user: User): User;
  
  updateUser(id: string, user: User): User | null;
  
  deleteUser(id: string): boolean;
  
  getAllHobbies(): Hobby[];
  
  getHobbyById(id: string): Hobby | null;
  
  createHobby(hobby: Hobby): Hobby;
  
  getHobbiesByUserId(userId: string): Hobby[];
}
