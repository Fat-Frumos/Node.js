import cluster from 'cluster';
import os from 'os';
import { config } from 'dotenv';
import express from 'express';
import { UserRouter } from './app/route/users';
import { startLoadBalancer, getNextWorker } from './loadBalancer';

config();

const app = express();
app.use(express.json());

const userRouter = new UserRouter();
app.use('/api/users', userRouter.router);

const PORT = process.env['PORT'] ?? 4000;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  
  const numCPUs = os.cpus().length;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  startLoadBalancer(1, (req, res) => {
    const worker = getNextWorker();
    worker.emit('request', req, res);
  });
  
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started and is listening on port ${PORT}`);
  });
}
