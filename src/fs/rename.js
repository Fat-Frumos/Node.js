import {access, rename as renameFile} from 'fs/promises';
import path from 'path';

const rename = async () => {

    const src = 'src/fs/files';
    const oldPath = path.join(src, 'wrongFilename.txt');
    const newPath = path.join(src, 'properFilename.md');

    try {
        await access(oldPath);
        await access(newPath);
        throw new Error('FS operation failed');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await renameFile(oldPath, newPath);
            console.log('File renamed successfully.');
        } else {
            console.error(error.message);
        }
    }
};

await rename();
