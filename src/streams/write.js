import {createWriteStream} from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const write = async () => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const fileName = `fileToWrite.txt`;
    const writeStream = createWriteStream(`${__dirname}/files/${fileName}`);

    process.stdin.on('data', (chunk) => writeStream.write(chunk));
    process.stdin.on('end', () => writeStream.end());
    writeStream.on('error', (err) => console.error('An error occurred:', err));
};

await write();