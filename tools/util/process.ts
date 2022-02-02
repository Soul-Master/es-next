export type CommandArgument = Record<string, boolean | string>;

export function waitAnyKeyForExit() {
    console.info('Press any key to exit...');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

export function getProcessArguments<T extends CommandArgument = CommandArgument>(): T {
    const result: CommandArgument = {};

    for (let item of process.argv) {
        item = item.trim();

        if (item.startsWith('--')) {
            item = item.substr(2);
        }

        const equalIndex = item.indexOf('=');
        let key = item;
        let value: string | boolean = true;

        if (equalIndex !== -1) {
            key = item.substr(0, equalIndex).trim();
            value = item.substr(equalIndex + 1).trim();

            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
                value = value.substr(1, value.length - 2);
            }
        }

        result[key] = value;
    }

    return <T>result;
}

export function isDevEnvironment() {
    return process.env.NODE_ENV === 'development';
}