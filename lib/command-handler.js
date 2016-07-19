'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = commandHandler;

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _api = require('./api.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParams() {
  var argv = require('yargs').argv;
  var arg = argv.params || argv.p || "{}";

  if (/\.(js|json)$/.test(arg)) {
    var filePath = _path2.default.resolve('.', arg);
    if (!(0, _api.fileExists)(filePath)) {
      console.log(_chalk2.default.red('Not valid params path.'));
      _process2.default.exit(-1);
    }
    return require(filePath);
  } else {
    try {
      var parsed = JSON.parse(arg);
      return parsed;
    } catch (e) {
      console.log(_chalk2.default.red('Not valid params must be json format.'));
      _process2.default.exit(-1);
    }
  }
}

function commandHandler() {
  var argv = require('yargs').argv;
  var command = argv._[0];

  switch (command) {
    case 'compile':
    case 'c':
      var params = getParams();
      var input = _path2.default.resolve('.', argv.input || argv.i);
      var output = _path2.default.resolve('.', argv.output || argv.o);
      var log = Boolean(argv.log || argv.l);
      var overwrite = Boolean(argv.overwrite);

      if (!(0, _api.fileExists)(input)) {
        console.log(_chalk2.default.red('Input file path is not valid.'));
        _process2.default.exit(-1);
      }

      (0, _api.compile)({
        params: params,
        input: input,
        output: output,
        log: log,
        overwrite: overwrite
      });
      break;
    default:
      (0, _api.help)();
      return;
  }
}