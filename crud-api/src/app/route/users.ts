import express from 'express';
import {
  createUser, deleteUser,
  getAllUsers,
  getUserById,
  updateUser
} from '../controller/users';

export const router = express.Router();

router.get('/', getAllUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.put('/:userId', updateUser);

router.delete('/:userId', deleteUser);
