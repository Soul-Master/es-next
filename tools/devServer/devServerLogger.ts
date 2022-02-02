import { Logger, PluginSyntaxError } from '@web/dev-server-core';

export class DevServerLogger implements Logger {
    log() { }
    debug() { }

    error() {
        console.error(arguments);
    }

    warn() {
        console.warn(arguments);
    }

    group() {
        console.group();
    }

    groupEnd() {
        console.groupEnd();
    }

    logSyntaxError(error: PluginSyntaxError) {
        console.error('Syntax Error', error);
    }
}