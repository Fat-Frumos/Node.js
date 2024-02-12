import request from 'supertest';
import app from '../../index';
import assert from 'node:assert';

describe('User API', () => {
  it('should create a new user and retrieve it back', async () => {
    const res = await request(app)
    .post('/api/users')
    .send({
      username: 'Alice',
      age: 30,
      hobbies: ['hiking', 'traveling']
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual('John');
    
    const userId = res.body.id;
    const resGet = await request(app).get(`/api/users/${userId}`);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.username).toEqual('John');
  });
});

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
});
