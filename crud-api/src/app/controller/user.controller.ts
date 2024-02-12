import {Request, Response} from 'express';
import {createUser} from '../model/user.model';
import {InMemoryDB} from '../dao/inMemory.database';

const db = new InMemoryDB();

export const userController = {
  getAllUsers: async (_req: Request, res: Response) => {
    const users = db.findAllUsers();
    res.status(200).json(users);
  },
  
  getUserById: async (req: Request, res: Response) => {
    const id = req.params['id'];
    const user = db.findUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  },
  
  createUser: async (req: Request, res: Response) => {
    const {username, age, hobbies} = req.body;
    if (!username || !age || !hobbies) {
      res.status(400).send('Missing required fields');
      return;
    }
    const user = createUser(username, age, hobbies);
    db.createUser(user);
    res.status(201).json(user);
  },
  
  updateUser: async (req: Request, res: Response) => {
    const id = req.params['id'];
    const {username, age, hobbies} = req.body;
    if (!username || !age || !hobbies) {
      res.status(400).send('Missing required fields');
      return;
    }
    const user = createUser(username, age, hobbies);
    const updatedUser = db.updateUser(id, user);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  },
  
  deleteUser: async (req: Request, res: Response) => {
    const id = req.params['id'];
    const deleted = db.deleteUser(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('User not found');
    }
  }
};
