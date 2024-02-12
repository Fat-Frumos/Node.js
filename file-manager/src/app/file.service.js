import fs, {readFile} from 'fs/promises';
import path from 'path';

export async function listFiles(cwd) {
    try {
        const files = await fs.readdir(cwd);
        const fileDetails = await Promise.all(files.map(async file => {
            const fullPath = path.join(cwd, file);
            try {
                const stats = await fs.stat(fullPath);
                const isDirectory = stats.isDirectory();
                const status = isDirectory ? '📁' : '📄';
                return { Type: status, File: file };
            } catch (error) {
                return { Type: '🔒', File: file };
            }
        }));
        console.log();
        console.table(fileDetails);
    } catch (error) {
        console.error('Error reading files:', error.message);
    }
}

export function hashFile(filePath) {
    const hash = crypto.createHash('sha256');
    fs.createReadStream(filePath).pipe(hash).pipe(process.stdout);
}

export const read = async (filePath) => {
    try {
        const data = await readFile(filePath, 'utf-8');
        console.log(data);
    } catch (error) {
        console.log(error.code === 'ENOENT'
            ? `File not found - ${filePath}`
            : `Error reading file: ${error.message}`);
        return null;
    }
};
