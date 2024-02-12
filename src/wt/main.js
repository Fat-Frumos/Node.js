import { Worker } from 'worker_threads';
import os from 'os';

const promises = [];
const numCores = os.cpus().length;
const workerPath = './src/wt/worker.js';

const performCalculations = async () => {

    const createWorker = (data) => {
        return new Promise((resolve) => {

            const worker = new Worker(workerPath, { workerData: data });
            worker.on('message', (result) => resolve(result));
            worker.on('error', (error) => resolve({ status: 'error', data: null }));
            worker.on('exit', (code) => {
                if (code !== 0) resolve({ status: 'error', data: null });
            });
        });
    };

    for (let i = 0; i < numCores; i++) {
        const data = 10 + i;
        promises.push(createWorker(data));
    }

    const results = await Promise.all(promises);
    console.log(results);
};

await performCalculations();