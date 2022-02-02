import * as fs from 'fs';
import * as rollup from 'rollup';
import * as fileUtil from '../util/file';

const extension = '.json';

/**
 * Remove BOM at the first character of the file to prevent the following error of `rollup-plugin-json` plugin.
 * 
 * SyntaxError: Unexpected token ﻿ in JSON at position 0
 */
export default function plugin(): rollup.Plugin {
    return {
        name: 'json-loader',
        load(id) {
            if (!id.endsWith(extension)) return null;

            let code = fs.readFileSync(id, 'utf-8');
            code = fileUtil.removeBOM(code);

            return {
                code: `export default ${code.trim()};`
            };
        }
    };
}