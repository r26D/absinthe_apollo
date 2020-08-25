// prettier-ignore
module.exports = {
    scripts: {
        "build:readme": "pkg-to-readme --template ./readmeTemplate.ejs --force && documentation readme src/** --markdown-toc=false --section API && doctoc README.md",
        "build:src:bundle": "rollup -c ../../rollup.config.js",
        "build:src:clean": "rm -rfv dist compat",
        "build:src": "nps 'build:src:clean' 'build:src:bundle'",
        "prepack": "nps 'build:src'",
        "version": "nps 'build:readme' && git add README.md",
    }
};