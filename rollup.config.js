// @flow
/* eslint-disable import/no-dynamic-require */

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import globby from "globby";
import {pascalCase} from "pascal-case";
import resolve from "@rollup/plugin-node-resolve";

// $FlowFixMe
const pkg = require(`${process.cwd()}/package.json`);
const srcDir = `${process.cwd()}/src`;

const dirs = {
    input: "src",
    output: "dist",
    compat: "compat"
};

const plugins = {
    babel: babel({
        configFile: "../../.babelrc",
        exclude: ["node_modules/**", "../../node_modules/**"],
        babelHelpers: 'runtime'
    }),
    commonjs: commonjs(),
    resolve: resolve({
        customResolveOptions: {
            moduleDirectory: srcDir
        }
    })
};

const getCjsAndEsConfig = fileName => ({
    input: `${dirs.input}/${fileName}`,
    output: [
        {
            file: `${dirs.output}/${fileName}`,
            format: "es",
            sourcemap: true
        },
        {
            file: `${dirs.compat}/cjs/${fileName}`,
            format: "cjs",
            sourcemap: true
        }
    ],
    plugins: [plugins.babel]
});

const sources = globby.sync("**/*js", {cwd: dirs.input});

// eslint-disable-next-line no-unused-vars
const getUnscopedName = pkg => {
    const [scope, name] = pkg.name.split("/");

    return pascalCase(scope) + pascalCase(name);
};

export default [
    {
        input: `${dirs.input}/index.js`,
        output: {
            file: `${dirs.compat}/umd/index.js`,
            format: "umd",
            name: pascalCase(getUnscopedName(pkg)),
            sourcemap: "inline",
            exports: "auto"
        },
        plugins: [plugins.babel, plugins.resolve, plugins.commonjs]
    },
    ...sources.map(getCjsAndEsConfig)
];