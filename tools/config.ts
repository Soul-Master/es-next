import resolve, { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';

export const srcProject = './src';
export const workerProject = './worker';
export const typescriptOutputFolder = 'build';
export const localPublishFolder = './dist';

export function nodeResolver(isDevMode = false) {
    const options: RollupNodeResolveOptions = {
        modulesOnly: false,
        extensions: ['.js', '.css'],
    };

    if (isDevMode) {
        // Use special export for development mode
        options.exportConditions = ['development'];
    }

    return resolve(options);
}