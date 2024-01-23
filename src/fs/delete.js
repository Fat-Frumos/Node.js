import {access, unlink} from 'fs/promises';

const remove = async () => {

    const src = 'src/fs/files';
    const fileName = 'fileToRemove.txt';
    const filePath = `${src}/${fileName}`;

    try {
        await access(filePath);
        await unlink(filePath);
        console.log('File deleted successfully.');
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('FS operation failed');
        } else {
            console.error(error.message);
        }
    }
};

await remove();
