import {startFileManager} from './app/dispatcher.js';

const username = process.argv[2] ? process.argv[2].split('=')[1] : 'User';

await startFileManager(username);
