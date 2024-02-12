import {access, readdir} from 'fs/promises';
import {failedError} from "./lib/error.js";

const src = 'src/fs/files';

const list = async () => {

    try {
        await access(src);
        const files = await readdir(src);
        console.log(files);
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw failedError;
        } else {
            console.error(error.message);
        }
    }
};

await list();
