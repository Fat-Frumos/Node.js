import {access, unlink} from 'fs/promises';
import {failedError} from "./lib/error.js";

const src = 'src/fs/files';
const fileName = 'fileToRemove.txt';
const filePath = `${src}/${fileName}`;

const remove = async () => {

    try {
        await access(filePath);
        await unlink(filePath);
        console.log('File deleted successfully.');
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw failedError;
        } else {
            console.error(error.message);
        }
    }
};

await remove();
