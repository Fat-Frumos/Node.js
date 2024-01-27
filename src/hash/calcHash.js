import {createReadStream} from 'fs';
import {createHash} from 'crypto';
import {fileURLToPath} from 'url';
import {resolve, dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fileSrc = 'fileToCalculateHashFor.txt';
const filePath = resolve(__dirname, 'files', fileSrc);
const hash = createHash('sha256');
const stream = createReadStream(filePath);

const calcHash = async () => {

    return new Promise((resolve, reject) => {

        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex', null)));
        stream.on('error', (error) => reject(error));

    }).then((hashResult) => {
        console.log(`SHA256 HashCode: ${hashResult}`);
    }).catch((error) => {
        console.error('Error calculating hash:', error.message);
    });
};

await calcHash();
