import {readFile} from 'fs/promises';

const read = async () => {

    const src = 'src/fs/files';
    const fileName = 'fileToRead.txt';
    const filePath = `${src}/${fileName}`;

    try {
        const data = await readFile(filePath, 'utf8');
        console.log(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('FS operation failed');
        } else {
            console.error(error.message);
        }
    }
};

await read();
