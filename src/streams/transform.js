import {Transform} from 'stream';

const reversed = (chunk) => chunk.split('').reverse().join('') + '\n';

const transform = async () => {

    const stream = new Transform({
        transform(chunk, encoding, callback) {
            this.push(reversed(chunk.toString()));
            callback();
        }
    });

    process.stdin.pipe(stream).pipe(process.stdout);
};

await transform();