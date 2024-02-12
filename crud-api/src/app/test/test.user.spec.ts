import request from 'supertest';
import app from '../../index';
import assert from 'node:assert';
import * as userController from '../controller/users';
import { v4 as uuid } from 'uuid';

const users = [
  {id: '1', username: 'Alice', age: 20, hobbies: ['music']},
  {id: '2', username: 'Bob', age: 30, hobbies: ['hiking']}
];

describe('User controller', () => {
  it('GET to /api/users returns all users', async () => {
    const response = await request(app).get('/api/users');
    assert(response.status === 200);
    assert.deepStrictEqual(response.body, users);
  });
  
  users.forEach(user => {
    it(`GET to /api/users/${user.id} returns user with id ${user.id}`, async () => {
      const response = await request(app).get(`/api/users/${user.id}`);
      assert(response.status === 200);
      assert.deepStrictEqual(response.body, user);
    });
  });
  
  it('POST to /api/users creates a new user', async () => {
    const newUser = {
      id: '3',
      username: 'Charlie',
      age: 25,
      hobbies: ['coding']
    };
    const response = await request(app)
    .post('/api/users')
    .send(newUser);
    assert(response.status === 201);
    assert.deepStrictEqual(response.body, newUser);
    users.push(newUser);
  });
  
  it('PUT to /api/users/:userId updates an existing user', async () => {
    const updatedUser = {...users[0], username: 'Updated Alice'};
    const response = await request(app)
    .put(`/api/users/${updatedUser.id}`)
    .send(updatedUser);
    assert(response.status === 200);
    assert.deepStrictEqual(response.body, updatedUser);
    users[0] = updatedUser;
  });
  
  it('DELETE to /api/users/:userId deletes an existing user', async () => {
    const response = await request(app).delete(`/api/users/${users[0].id}`);
    assert(response.status === 204);
    users.shift();
  });
  
  it('GET to /api/users/:userId returns 404 for deleted user', async () => {
    const response = await request(app).get(`/api/users/${users[0].id}`);
    assert(response.status === 404);
  });
});

describe('Mock the users module', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('GET to /api/users returns all users', async () => {
    jest.spyOn(userController, 'getAllUsers').mockImplementation(() => Promise.resolve(users));
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
    expect(userController.getAllUsers).toHaveBeenCalledTimes(1);
  });
  
  it('GET to /api/users/:userId returns user with userId', async () => {
    const user = users[0];
    jest.spyOn(userController, 'getUserById').mockImplementation(() => Promise.resolve(user));
    const response = await request(app).get(`/api/users/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
    expect(userController.getUserById).toHaveBeenCalledTimes(1);
  });
  
  it('POST to /api/users creates a new user', async () => {
    const newUser = {
      id: uuid(),
      username: 'Charlie',
      age: 25,
      hobbies: ['coding']
    };
    jest.spyOn(userController, 'createUser').mockImplementation(() => Promise.resolve(newUser));
    const response = await request(app)
    .post('/api/users')
    .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newUser);
    expect(userController.createUser).toHaveBeenCalledTimes(1);
  });
  
  it('PUT to /api/users/:userId updates an existing user', async () => {
    const updatedUser = {...users[0], username: 'Updated Alice'};
    jest.spyOn(userController, 'updateUser').mockImplementation(() => Promise.resolve(updatedUser));
    const response = await request(app)
    .put(`/api/users/${updatedUser.id}`)
    .send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUser);
    expect(userController.updateUser).toHaveBeenCalledTimes(1);
  });
  
  it('DELETE to /api/users/:userId deletes an existing user', async () => {
    jest.spyOn(userController, 'deleteUser').mockImplementation(() => Promise.resolve());
    const response = await request(app).delete(`/api/users/${users[0].id}`);
    expect(response.status).toBe(204);
    expect(userController.deleteUser).toHaveBeenCalledTimes(1);
  });
});
