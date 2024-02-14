import {v4 as uuidv4} from 'uuid';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: Hobby[];
}

export interface Hobby {
  id: string;
  name: string;
  userId: string;
}

export function createUser(username: string, age: number, hobbies: Hobby[]): User {
  return {
    id: uuidv4(),
    username,
    age,
    hobbies
  };
}

export function createHobby(name: string, userId: string): Hobby {
  return {
    id: uuidv4(),
    name,
    userId
  };
}
