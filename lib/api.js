'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileExists = fileExists;
exports.compile = compile;
exports.help = help;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _mkdirp = require('mkdirp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var packageJson = require('../package.json');
function fileExists(file) {
  try {
    _fs2.default.accessSync(file, _fs2.default.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function recursiveDirectory(input, fn) {
  var isDirectory = _fs2.default.lstatSync(input).isDirectory();

  if (isDirectory) {
    var files = _fs2.default.readdirSync(input);
    files.forEach(function (file) {
      var filePath = _path2.default.resolve(input, file);
      recursiveDirectory(filePath, fn);
    });
  } else {
    fn(input);
  }
}

function compileTemplate() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var templateFilePath = _ref.templateFilePath;
  var outputFilePath = _ref.outputFilePath;
  var params = _ref.params;
  var _ref$log = _ref.log;
  var log = _ref$log === undefined ? false : _ref$log;
  var _ref$overwrite = _ref.overwrite;
  var overwrite = _ref$overwrite === undefined ? false : _ref$overwrite;

  var templateFile = _fs2.default.readFileSync(templateFilePath, 'utf8');
  var compileFn = _handlebars2.default.compile(templateFile);
  var rendered = compileFn(params);

  if (!overwrite && fileExists(outputFilePath)) {
    if (log) console.log(_chalk2.default.yellow('File already exists ' + outputFilePath));
    return;
  }

  if (log) console.log(_chalk2.default.green('Creating the file at ' + outputFilePath));

  (0, _mkdirp.sync)(_path2.default.dirname(outputFilePath));
  _fs2.default.writeFileSync(outputFilePath, rendered);
}

function compile() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref2$params = _ref2.params;
  var params = _ref2$params === undefined ? {} : _ref2$params;
  var input = _ref2.input;
  var output = _ref2.output;
  var _ref2$log = _ref2.log;
  var log = _ref2$log === undefined ? false : _ref2$log;
  var _ref2$overwrite = _ref2.overwrite;
  var overwrite = _ref2$overwrite === undefined ? false : _ref2$overwrite;


  if (_fs2.default.lstatSync(input).isDirectory()) {
    recursiveDirectory(input, function (filePath) {
      if (/^\./.test(_path2.default.basename(filePath))) {
        return;
      }
      var pathDiff = filePath.replace(input + '/', '');
      var outputFilePath = _path2.default.resolve(output, pathDiff);

      compileTemplate({
        templateFilePath: filePath,
        outputFilePath: outputFilePath,
        params: params,
        log: log,
        overwrite: overwrite
      });
    });
  } else {
    compileTemplate({
      templateFilePath: input,
      outputFilePath: output,
      params: params,
      log: log,
      overwrite: overwrite
    });
  }
}

function help() {
  console.log('');
  console.log('  ' + packageJson.name + ' ' + packageJson.version);
  console.log('');
  console.log('  compile');
  console.log('    --[params | p]');
  console.log('      json string or json file location or js module export file location');
  console.log('    --[input | i]');
  console.log('      template input file path can be directory or file');
  console.log('    --[output | o]');
  console.log('      ouput directory');
  console.log('    --[log | l]');
  console.log('      log info');
  console.log('    --overwrite');
  console.log('      overwrite existing file');
  console.log('');
}