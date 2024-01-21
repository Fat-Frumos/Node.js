import os from 'os';
import {join} from 'path';
import readline from 'readline';
import {osCommand} from './command.js';
import {hashFile, listFiles, read} from './file.service.js';
import {compressFile, decompressFile} from './zip.service.js';
import {changeDirectory, goUpDirectory} from "./navigation.service.js";

const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let currentDir = process.env.HOME || process.env.USERPROFILE;

const display = (message) => console.log(message);

const currently = `You are currently in`;

const error = 'Invalid input';

let cwd = os.homedir();

const commands = ['cd', 'up', 'ls', 'cat', 'os', 'hash', 'compress', 'decompress', 'tab'];

function navigator(args) {
    if (args.length === 0) {
        display(error);
        return;
    }

    let targetDir;
    if (args[0] === '~') {
        targetDir = currentDir;
    } else if (args[0] === '.') {
        targetDir = cwd;
    } else if (/^[A-Za-z]:[\\/]*$/.test(args[0])) {
        targetDir = args[0];
    } else {
        targetDir = changeDirectory(cwd, args[0]);
    }

    if (targetDir) {
        cwd = targetDir;
        display(`${currently} ${cwd}`);
    } else {
        display(error);
    }
}

function exit(input, username) {
    if (input.trim() === '.exit') {
        display(`Thank you for using File Manager, ${username}, goodbye!`);
        process.exit(0);
    } else {
        display(error);
    }
}

export async function startFileManager(username) {

    console.log(`Welcome to the File Manager, ${username}!`);
    console.log(`${currently} ${cwd}`);
    cli.setPrompt('>');

    cli.on('line', async (input) => {

        const [command, ...args] = input.split(' ');

        switch (command) {
            case 'cd':
                if (args.length === 0) {
                    display(error);
                    break;
                }
                navigator(args);
                break;
            case 'up':
                cwd = goUpDirectory(cwd);
                display(cwd ? `${currently} ${cwd}` : error);
                break;
            case 'ls':
                await listFiles(cwd);
                cli.setPrompt('>');
                break;
            case 'cat': {
                const fileContent = args[0] ? await read(join(cwd, args[0])) : null;
                if (fileContent !== null) {
                    display(fileContent);
                }
            }
                break;
            case 'os':
                osCommand(args);
                break;
            case 'hash':
                hashFile(join(cwd, args[0]));
                break;
            case 'compress':
                await compressFile(join(cwd, args[0]), join(cwd, args[1]));
                break;
            case 'decompress':
                await decompressFile(join(cwd, args[0]), join(cwd, args[1]));
                break;
            default:
                exit(input, username);
        }
        cli.prompt();

    }).on('close', () => {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        process.exit(0);
    });
    cli.prompt();
}
