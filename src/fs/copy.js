import {access, copyFile, mkdir, readdir} from 'fs/promises';
import {join} from 'path';

const copy = async () => {

    const src = 'src/fs/files';
    const dest = 'src/fs/files_copy';

    async function copyFiles(files) {
        for (let file of files) {
            const srcFile = join(src, file);
            const destFile = join(dest, file);
            await copyFile(srcFile, destFile);
            console.log(`Copied file ${file} to ${dest}`);
        }
    }

    try {
        await access(src);
        await access(dest);
        throw new Error('FS operation failed');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await mkdir(dest, { recursive: true });
            const files = await readdir(src);
            await copyFiles(files);
        } else {
            console.error(error.message);
        }
    }
};

await copy();
