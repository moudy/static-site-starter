var env = {};
env[process.env.NODE_ENV] = true;

// Plugins
var mergeTrees = require('broccoli-merge-trees');
var uglifyJS = require('broccoli-uglify-js');
var sass = require('broccoli-sass');
var browserify = require('broccoli-browserify');
var cleanCSS = require('broccoli-clean-css');
var fingerprint = require('broccoli-fingerprint');
var gzip = require('broccoli-gzip');
var base64CSS = require('broccoli-base64-css');
var pickFiles = require('broccoli-static-compiler');

// Asset trees
var css = 'css';
var js = 'js';
var html = 'html';

// Output tree and files
var outputTree = [];
var APP_JS = 'assets/app.js';
var APP_CSS = 'assets/app.css';

var index = pickFiles(html, {
  files: ['index.html']
, srcDir: '.'
, destDir: '.'
});

var appCss = sass([css], 'app.scss', APP_CSS);
appCss = base64CSS(appCss, {imagePath: 'images'});

var appJs = browserify(js, {
  entries: ['./app.js']
, outputFile: APP_JS
, bundle: {debug: !env.production}
});

if (env.production) {
  appJs = uglifyJS(appJs);
  appJs = fingerprint(appJs);
  appJs = gzip(appJs, {extensions: ['js'], keepUncompressed: true});
  appCss = cleanCSS(appCss);
  appCss = fingerprint(appCss);
  appCss = gzip(appCss, {extensions: ['css'], keepUncompressed: true});
}

outputTree.push(index);
outputTree.push(appCss);
outputTree.push(appJs);

console.log(outputTree);
module.exports = mergeTrees(outputTree, {overwrite: true});
