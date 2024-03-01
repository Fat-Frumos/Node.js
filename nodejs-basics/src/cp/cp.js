import {spawn} from 'child_process';

const spawnChildProcess = async (args) => {
    const childProcess = spawn('node', ['./src/cp/files/script.js', ...args], {
        stdio: ['pipe', 'pipe', 'inherit'],
    });

    process.stdin.on('data', (data) => childProcess.stdin.write(data));
    childProcess.stdout.on('data', (data) => process.stdout.write(data));

    process.on('SIGINT', () => {
        childProcess.stdin.write('CLOSE');
        process.exit(0);
    });

    childProcess.on('close', (code) => process.exit(code));
};

spawnChildProcess(['arg1', 'arg2', 'arg3']);
