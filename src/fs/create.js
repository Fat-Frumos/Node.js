import {access, mkdir, writeFile} from 'fs/promises';

const create = async () => {

    const fileName = 'fresh.txt';
    const src = 'src/fs/files';
    const filePath = `${src}/${fileName}`;
    const context = 'I am fresh and young';

    try {
        await mkdir(src, { recursive: true });
        await access(filePath);
        throw new Error('FS operation failed');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await writeFile(filePath, context);
            console.log('File created successfully.');
        } else {
            console.error(error.message);
        }
    }
};

await create();
