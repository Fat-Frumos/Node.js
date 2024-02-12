import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/users') {
    if (req.method === 'GET') {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify([]));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({message: 'Endpoint not found'}));
    }
  } else if (req.url?.startsWith('/api/users/')) {
    if (req.method === 'GET') {
      const userId = req.url.split('/')[3];
      const user = {
        id: userId,
        username: 'John',
        age: 30,
        hobbies: ['coding', 'reading']
      };
      if (user) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'User not found'}));
      }
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({message: 'Endpoint not found'}));
    }
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'Endpoint not found'}));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
