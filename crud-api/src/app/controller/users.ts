import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import {User} from '../model/user.model';

const users: User[] = [];

export const getAllUsers = (req: Request, res: Response) => {
  res.status(200).json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = users.find(user => user.id === userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  } else {
    res.status(200).json(user);
  }
};

export const createUser = (req: Request, res: Response) => {
  const { username, age, hobbies } = req.body;
  if (!username || !age) {
    res.status(400).json({ message: 'Username and age are required' });
  } else {
    const newUser: User = {
      id: uuid(),
      username,
      age,
      hobbies: hobbies || [],
    };
    users.push(newUser);
    res.status(201).json(newUser);
  }
};

export const updateUser = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { username, age, hobbies } = req.body;
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    res.status(404).json({ message: 'User not found' });
  } else {
    if (!username || !age) {
      res.status(400).json({ message: 'Username and age are required' });
    } else {
      users[userIndex] = {
        id: userId,
        username,
        age,
        hobbies: hobbies || [],
      };
      res.status(200).json(users[userIndex]);
    }
  }
};

export const deleteUser = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    res.status(404).json({ message: 'User not found' });
  } else {
    users.splice(userIndex, 1);
    res.status(204).send();
  }
};
