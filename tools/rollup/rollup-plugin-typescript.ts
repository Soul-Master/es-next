import * as fs from 'fs';
import * as path from 'path';
import * as rollup from 'rollup';
import * as config from '../config';

interface CompositeConfig {
    references: ProjectReference[];
}

interface ProjectReference {
    path: string;
}

interface ProjectInfo {
    pathPrefix: string;
    buildFolder: string;
}

const tsExtension = '.ts';
const jsExtension = '.js';
const nodeModulePath = path.resolve('./node_modules');

export default function plugin(): rollup.Plugin {
    const tsConfigFile = fs.readFileSync('./tsconfig.json', { encoding: 'utf-8' });
    const tsConfig = <CompositeConfig>JSON.parse(tsConfigFile);
    const projects: ProjectInfo[] = [];

    for (const r of tsConfig.references) {
        const pathPrefix = path.resolve(r.path) + path.sep;
        const buildFolder = pathPrefix + config.typescriptOutputFolder;

        projects.push({ pathPrefix, buildFolder });
    }

    return {
        name: 'typescript',
        resolveId(source, importer) {
            // Ignore normal file
            const ext = path.extname(source);
            if (ext) return null;

            // Ignore resolving node_module
            if (!source.startsWith('.') && !source.startsWith('/')) return null;
            if (!importer) return null;

            // Ignore file in node_module
            if (importer.startsWith(nodeModulePath)) return null;

            // Automatically add TypeScript extension to extensionless file
            return path.resolve(path.dirname(importer), source) + tsExtension;
        },
        load(id) {
            const ext = path.extname(id);
            if (ext !== tsExtension && ext !== jsExtension) return null;

            let compiledFilePath: string | undefined;

            for (const p of projects) {
                if (id.startsWith(p.pathPrefix)) {
                    compiledFilePath = path.join(p.buildFolder, id.substring(p.pathPrefix.length));
                    break;
                }
            }

            if(compiledFilePath === undefined) return null;

            compiledFilePath = compiledFilePath.substring(0, compiledFilePath.length - ext.length) + jsExtension;

            return { code: fs.readFileSync(compiledFilePath, 'utf-8') };
        }
    };
}