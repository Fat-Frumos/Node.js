import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import index from './index';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

if (cluster.isWorker) {
  const id = cluster.worker?.id;
  if (id !== undefined) {
    index.listen(port + id, () => {
      console.log(`Worker ${id} running on port ${port + id}`);
    });
  }
} else {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount - 1; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', () => {
    cluster.fork();
  });
}
