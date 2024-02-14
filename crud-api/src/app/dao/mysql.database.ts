import mysql, { RowDataPacket } from "mysql2";
import {Hobby, User} from '../model/user.model';
import {ConnectionPool} from './pool.connection';
import {DatabaseModel} from './database.model';

export class MySQL implements DatabaseModel {
  
  private connection!: mysql.Connection;
  
  constructor() {
    this.initializeConnection().then(() => {
      console.log('Connection initialized');
    }).catch(error => {
      console.error('Failed to initialize connection:', error);
    });
  }
  
  private async initializeConnection() {
    this.connection = await new ConnectionPool().getConnection();
  }
  
  getAllUsers(): User[] {
    const users: User[] = [];
    const query = 'SELECT * FROM users';
    this.connection.query(query, (error, results: User[]) => {
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        users.push(...results);
      }
    });
    return users;
  }
  
  getAllHobbies(): Hobby[] {
    const hobbies: Hobby[] = [];
    const query = 'SELECT * FROM hobbies';
    this.connection.query(query, (error, results: Hobby[]) => {
      if (error) {
        console.error('Error fetching hobbies:', error);
      } else {
        hobbies.push(...results);
      }
    });
    return hobbies;
  }
  
  getHobbyById(id: string): Hobby | null {
    let hobby: Hobby | null = null;
    const query = 'SELECT * FROM hobbies WHERE id = ?';
    this.connection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error fetching hobby by id:', error);
      } else {
        const hobbies = results as RowDataPacket[];
        hobby = hobbies.length > 0 ? hobbies[0] as Hobby : null;
      }
    });
    return hobby;
  }
  
  createUser(user: User): User {
    const query = 'INSERT INTO users (id, username, age, hobby_id) VALUES (?, ?, ?, ?)';
    this.connection.query(query, [user.id, user.username, user.age, JSON.stringify(user.hobbies)], (error) => {
      if (error) {
        console.error('Error creating user:', error);
      }
    });
    return user;
  }
  
  getUserById(userId: string): User | null {
    let user: User | null = null;
    const query = 'SELECT * FROM users WHERE id = ?';
    this.connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching user by id:', error);
      } else {
        const users = results as RowDataPacket[];
        user = users.length > 0 ? users[0] as User : null;
      }
    });
    return user;
  }

  updateUser(userId: string, updatedUser: User): User | null {
    const query = 'UPDATE users SET username = ?, age = ?, hobby_id = ? WHERE id = ?';
    this.connection.query(query, [updatedUser.username, updatedUser.age, JSON.stringify(updatedUser.hobbies), userId], (error) => {
      if (error) {
        console.error('Error updating user:', error);
      }
    });
    return updatedUser;
  }
  
  deleteUser(userId: string): boolean {
    const query = 'DELETE FROM users WHERE id = ?';
    let success = true;
    this.connection.query(query, [userId], (error) => {
      if (error) {
        console.error('Error deleting user:', error);
        success = false;
      }
    });
    return success;
  }

  
  createHobby(hobby: Hobby): Hobby {
    const query = 'INSERT INTO hobbies (id, name) VALUES (?, ?)';
    this.connection.query(query, [hobby.id, hobby.name], (error) => {
      if (error) {
        console.error('Error creating hobby:', error);
      }
    });
    return hobby;
  }
  
  getHobbiesByUserId(userId: string): Hobby[] {
    const hobbies: Hobby[] = [];
    const query = 'SELECT * FROM hobbies WHERE user_id = ?';
    this.connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching hobbies by user id:', error);
      } else {
        const hobbyResults = results as RowDataPacket[];
        hobbies.push(...hobbyResults as Hobby[]);
      }
    });
    return hobbies;
  }
}
