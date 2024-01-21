import fs from 'fs';
import {join} from 'path';

export function changeDirectory(cwd, target) {
    if (!cwd || !target) {
        console.log('Invalid input');
        return null;
    }

    let newDir;
    if (target.endsWith(':')) {
        newDir = target + '\\';
    } else {
        newDir = join(cwd, target);
    }

    if (fs.existsSync(newDir)) {
        return newDir;
    }
    return null;
}


export function goUpDirectory(currentDir) {
    return  changeDirectory(currentDir, '..');
}
