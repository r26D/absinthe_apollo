// prettier-ignore
module.exports = {
    scripts: {
        "build:readme": "pkg-to-readme --template ./readmeTemplate.ejs --force && documentation readme src/** --markdown-toc=false --section API && doctoc README.md",
        "prepare": "nps  'prepare:clean' 'prepare:js' 'prepare:prettier'",
        "prepare:clean": "rm -rf lib",
        "prepare:js": "babel src -d lib",
        "prepare:prettier": "prettier 'lib/**/*.js'  --write",
        "version": "nps 'build:readme' && git add README.md",
    }
};