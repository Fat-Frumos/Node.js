import {
    getArchitecture,
    getCPUs,
    getEOL,
    getHomeDir,
    getUsername
} from "./os.service.js";

export function osCommand(args) {
    switch (args[0]) {
        case '--EOL':
            console.log(getEOL());
            break;
        case '--cpus':
            console.log(getCPUs());
            break;
        case '--homedir':
            console.log(getHomeDir());
            break;
        case '--username':
            console.log(getUsername());
            break;
        case '--architecture':
            console.log(getArchitecture());
            break;
        default:
            console.log('Invalid input');
    }
}
