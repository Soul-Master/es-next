import Koa from 'koa';
import path from 'path';

const nodePrefix = '/node_modules/';
const srcPrefix = '/src/';
const workerPrefix = '/worker/';
const serviceWorkerPrefix = '/service-worker/';

export default function (context: Koa.ParameterizedContext, next: Koa.Next) {
    let url = context.url;
    let ext = path.extname(url).toLowerCase();

    if (!url.startsWith(nodePrefix) && !url.startsWith(workerPrefix) && !url.startsWith(serviceWorkerPrefix)) {
        // Rewrite path for `src` folder
        url = context.url = srcPrefix + url;
    }

    switch (ext) {
        case '.css':
        case '.svg':
        case '.json':
        case '.htm':
        case '.html':
            context.type = 'js';
            break;
    }

    return next();
}