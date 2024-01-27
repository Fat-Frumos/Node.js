import {createReadStream} from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const fileName = 'fileToRead.txt';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const readStream = createReadStream(`${__dirname}/files/${fileName}`);

const read = async () => {

    readStream.on('data', (chunk) => process.stdout.write(chunk));
    readStream.on('error', (err) => console.error('An error occurred:', err));
};

await read();
