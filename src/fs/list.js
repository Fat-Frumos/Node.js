import {access, readdir} from 'fs/promises';

const list = async () => {

    const src = 'src/fs/files';

    try {
        await access(src);
        const files = await readdir(src);
        console.log(files);
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('FS operation failed');
        } else {
            console.error(error.message);
        }
    }
};

await list();
