import * as fs from 'fs';
import * as glob from 'glob';

const bomChar = 0xFEFF;

export function remove(pathOrPattern: string) {
    if (pathOrPattern.includes('*')) {
        const files = glob.sync(pathOrPattern);

        for (const f of files) {
            fs.rmSync(f, { force: true });
        }
    }
    else {
        if (fs.existsSync(pathOrPattern)) {
            fs.rmSync(pathOrPattern, { force: true, recursive: true });
        }
    }
}

export function removeBOM(fileContent: string) {
    if (!fileContent || fileContent.charCodeAt(0) !== bomChar) return fileContent;

    return fileContent.slice(1);
}