import express from 'express';
import {userController} from '../controller/user.controller';


export class UserRouter {
  public router = express.Router();
  
  constructor() {
    this.initializeRoutes();
  }
  
  private initializeRoutes() {
    this.router.get('/', (req, res, next) => {
      userController.getAllUsers(req, res).catch(next);
    });
    this.router.get('/:id', (req, res, next) => {
      userController.getUserById(req, res).catch(next);
    });
    this.router.post('/', (req, res, next) => {
      userController.createUser(req, res).catch(next);
    });
    this.router.put('/:id', (req, res, next) => {
      userController.updateUser(req, res).catch(next);
    });
    this.router.delete('/:id', (req, res, next) => {
      userController.deleteUser(req, res).catch(next);
    });
  }
}
