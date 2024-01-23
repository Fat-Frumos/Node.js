import {createReadStream, createWriteStream} from 'fs';
import {createGzip} from 'zlib';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const compress = async () => {

    const txt = `/files/fileToCompress.txt`;
    const gz = `/files/archive.gz`;

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const readStream = createReadStream(`${__dirname}${txt}`);
    const writeStream = createWriteStream(`${__dirname}${gz}`);

    readStream.pipe(createGzip()).pipe(writeStream);

};

await compress();
