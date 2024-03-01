import {readFile} from 'fs/promises';
import {failedError} from "./lib/error.js";

const src = 'src/fs/files';
const fileName = 'fileToRead.txt';
const filePath = `${src}/${fileName}`;

const read = async () => {

    try {
        const data = await readFile(filePath, 'utf-8');
        console.log(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw failedError;
        } else {
            console.error(error.message);
        }
    }
};

await read();
