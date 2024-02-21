import * as http from 'http';
import { createServer, RequestListener } from 'http';

let currentWorkerIndex = 0;
let workers: http.Server[] = [];

export function startLoadBalancer(numWorkers: number, requestListener: RequestListener) {
  for (let i = 0; i < numWorkers; i++) {
    workers.push(createServer(requestListener));
  }
  workers.forEach((worker, index) => {
    const port = 4000 + index + 1;
    worker.listen(port, () => {
      console.log(`Load balancer for worker ${index + 1} is listening on port ${port}`);
    });
  });
}

export function getNextWorker() {
  const worker = workers[currentWorkerIndex];
  currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
  return worker;
}
