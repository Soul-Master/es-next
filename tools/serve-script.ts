import { DevServer, DevServerCoreConfig } from '@web/dev-server-core';
import { rollupAdapter } from '@web/dev-server-rollup';
import { nodeResolver } from './config';
import { DevServerLogger } from './devServer/devServerLogger';
import rewritePathMiddleware from './devServer/rewritePathMiddleware';
import jsonLoader from './rollup/rollup-plugin-json-loader';
import typescript from './rollup/rollup-plugin-typescript';
import * as processUtil from './util/process';
import { CommandArgument } from './util/process';

interface ServeCommandArgument extends CommandArgument {
    /**
     * Dev server port
     */
    port: string;
}

const defaultPort = 80;

export function getConfig(port = defaultPort): DevServerCoreConfig {
    return {
        hostname: 'localhost',
        port,
        rootDir: process.cwd(),

        // These config cannot be overridden.
        middleware: [
            rewritePathMiddleware
        ],
        plugins: [
            rollupAdapter(nodeResolver(true)),
            rollupAdapter(typescript()),
            rollupAdapter(jsonLoader())
        ]
    };
}

export function createServer(config?: DevServerCoreConfig): DevServer {
    const args = processUtil.getProcessArguments<ServeCommandArgument>();
    if (!config) {
        const port = args.port ? parseInt(args.port, 10) : defaultPort;
        config = getConfig(port);
    }

    const logger = new DevServerLogger();
    const server = new DevServer(config, logger);

    return server;
}

async function main() {
    process.env.NODE_ENV = 'development';

    const server = await createServer();

    process.on('uncaughtException', error => {
        /* eslint-disable-next-line no-console */
        console.error(error);
    });

    process.on('SIGINT', async () => {
        await server.stop();
        process.exit(0);
    });

    await server.start();

    console.info('Create ES Dev Server on port ' + server.config.port);
}

if (require.main === module) {
    // Auto execute main function if it was started directly from commandline.
    main();
}