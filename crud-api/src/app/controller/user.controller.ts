import {Request, Response} from 'express';
import {createUser, User} from '../model/user.model';
import {DBManager} from '../dao/database.manager';
import {DatabaseType} from '../dao/database.type';
import {DatabaseModel} from '../dao/database.model';

const dao: DatabaseModel = DBManager.connect(DatabaseType.MySQL);

export const userController = {
  
  getAllUsers: async (_req: Request, res: Response) => {
    const users = dao.getAllUsers();
    res.status(200).json(users);
  },
  
  getUserById: async (req: Request, res: Response) => {
    const id = req.params['id'];
    const user: User | null = dao.getUserById(id);
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
    const saved = dao.createUser(user);
    res.status(201).json(saved);
  },
  
  updateUser: async (req: Request, res: Response) => {
    const id = req.params['id'];
    const {username, age, hobbies} = req.body;
    if (!username || !age || !hobbies) {
      res.status(400).send('Missing required fields');
      return;
    }
    const user = createUser(username, age, hobbies);
    const updatedUser = dao.updateUser(id, user);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  },
  
  deleteUser: async (req: Request, res: Response) => {
    const id = req.params['id'];
    const deleted: boolean = dao.deleteUser(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('User not found');
    }
  }
};
