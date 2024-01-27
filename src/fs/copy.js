import {access, copyFile, mkdir, readdir} from 'fs/promises';
import {join} from 'path';
import {failedError} from "./lib/error.js";

const src = 'src/fs/files';
const dest = 'src/fs/files_copy';

const copyFiles = async (files) => {
    for (let file of files) {
        await copyFile(join(src, file), join(dest, file));
        console.log(`Copied file ${file} to ${dest}`);
    }
}

const copy = async () => {

    try {
        await access(src);
        await access(dest);
        throw failedError;
    } catch (error) {
        if (error.code === 'ENOENT') {
            await mkdir(dest, {recursive: true});
            const files = await readdir(src);
            await copyFiles(files);
        } else {
            console.error(error.message);
        }
    }
};

await copy();
