import {release, version} from 'os';
import {createServer as createServerHttp} from 'http';
import {access, readFile} from 'fs/promises';
import {fileURLToPath} from 'url';
import {dirname, resolve, sep} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = dirname(new URL(import.meta.url).pathname);

const PORT = 3000;
const cjs = './files/c.js';
const random = Math.random();
const jsonFileName = (random > 0.5) ? './files/a.json' : './files/b.json';

import(cjs).catch(error => console.error('Error importing module:', error.message));

const readJsonFile = async (json) => {
    try {
        await access(json);
        const content = await readFile(json, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        const data = error.code === 'ENOENT'
            ? `File not found: ${json}`
            : `Error reading JSON file '${json}': ${error.message}`;
        console.error(data);
    }
};

export const unknownObject = await readJsonFile(resolve(__dirname, `${jsonFileName}`));

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${sep}"`);

console.log(`Path to current file is ${import.meta.url}`);
console.log(`Path to current directory is ${dir}`);

export const myServer = createServerHttp((_, res) => res.end('Request accepted'));

console.log(unknownObject);

myServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('To terminate it, use Ctrl+C combination');
});
