import {createReadStream, createWriteStream} from 'fs';
import {createGunzip} from 'zlib';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const decompress = async () => {

    const gz = `/files/archive.gz`;
    const txt = `/files/fileToCompress.txt`;

    const __dirname = dirname(fileURLToPath(import.meta.url));

    const readStream = createReadStream(`${__dirname}${gz}`);
    const writeStream = createWriteStream(`${__dirname}${txt}`);

    readStream.pipe(createGunzip()).pipe(writeStream);
};

await decompress();