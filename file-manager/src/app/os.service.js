import os from 'os';

export function getEOL() {
    return os.EOL;
}

export function getCPUs() {
    return os.cpus();
}

export function getHomeDir() {
    return os.homedir();
}

export function getUsername() {
    return os.userInfo().username;
}

export function getArchitecture() {
    return os.arch();
}
