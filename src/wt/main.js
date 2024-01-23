import { Worker } from 'worker_threads';
import os from 'os';

const performCalculations = async () => {
    const numCores = os.cpus().length;
    const promises = [];

    const createWorker = (data) => {
        return new Promise((resolve) => {
            const worker = new Worker('./src/wt/worker.js', { workerData: data });

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