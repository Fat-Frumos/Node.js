import {access, mkdir, writeFile} from 'fs/promises';
import {failedError} from "./lib/error.js";

const src = 'src/fs/files';
const fileName = 'fresh.txt';
const filePath = `${src}/${fileName}`;
const content = 'I am fresh and young';

const create = async () => {

    try {
        await mkdir(src, { recursive: true });
        await access(filePath);
        throw failedError;
    } catch (error) {
        if (error.code === 'ENOENT') {
            await writeFile(filePath, content, {flags: 'wx'});
            console.log('File created successfully.');
        } else {
            console.error(error.message);
        }
    }
};

await create();
