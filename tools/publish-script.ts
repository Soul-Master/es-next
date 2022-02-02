import * as cpx from 'cpx';
import * as fs from 'fs';
import * as config from './config';
import * as file from './util/file';

/*
 * Publish all bundled/resource files to local folder (`./dist`)
 */
async function main() {
    file.remove(config.localPublishFolder);
    fs.mkdirSync(config.localPublishFolder);

    cpx.copySync('src/**/*.html', 'dist');
    cpx.copySync('worker/build/**/*.js', 'dist/worker');
    cpx.copySync('src/build/**/*.js', 'dist');
}

main();