import {v4 as uuidv4} from 'uuid';
import {Hobby, User} from '../model/user.model';

let users: User[] = [];

export const getUsers = (): User[] => users;

export const getUser = (id: string): User | undefined => users.find(user => user.id === id);

export const createUser = (username: string, age: number, hobbies: Hobby[]): User => {
  const user: User = {id: uuidv4(), username, age, hobbies};
  users.push(user);
  return user;
};

export const updateUser = (id: string, username: string, age: number, hobbies: Hobby[]): User | {} => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return {};
  const user: User = {id, username, age, hobbies};
  users[userIndex] = user;
  return user;
};

export const deleteUser = (id: string): boolean => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return false;
  users.splice(userIndex, 1);
  return true;
};
