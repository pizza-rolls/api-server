'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * config/config.js
 *
 * Utils/Constructor for creating and setting up the config object
 */

var path = require('path');
var commander = require('commander');

var _require = require('lodash');

var defaultsDeep = _require.defaultsDeep;

var utils = require('./utils');
var modules = require('./modules');

/**
 * Constructor for an app config object - Only creates a config object and returns
 * constructor() {object} Optional configs passed in on instantiation
 *  {
 *    configDir <String> optional // defaults to root/config
 *  }
 */
module.exports = function Config(_config) {
  _classCallCheck(this, Config);

  // param passed into constructor during instantiation
  this._config = _config || {};

  // command-line args
  this._args = getCommandLineArgs();

  this.connections = {};
  this.controllers = {};
  this.globals = {};
  this.logger = {};
  this.middleware = {};
  this.policies = {};
  this.routes = {};
  this.server = {};
  this.services = {};
  this.session = {};
  this.sockets = {};

  var definedConfigDir = _config.configDir;

  var defaultConfigs = getDefaultConfigs();
  var definedConfigs = getDefinedConfigs(definedConfigDir);
  // merge configs - add default configs around definedConfigs
  var mergedConfigs = defaultsDeep(definedConfigs, defaultConfigs);

  Object.assign(this, mergedConfigs);

  return this;
};

/**
 * Get command line args (process.args)
 * @return {object} commander module return val
 */
var getCommandLineArgs = function getCommandLineArgs() {
  // get command-line args
  try {
    commander.option('-p, --port [port]', 'Port Number').option('-i, --interactive [interactive]', 'Start in interactive mode').parse(process.argv);
  } catch (e) {
    console.log(new Error('commander cli failed'));
  }
  return commander;
};

/**
 * Returns the default configs HashMap
 * @return {object}
 */
var getDefaultConfigs = function getDefaultConfigs() {
  var defaultsDir = path.join(path.parse(module.filename).dir, '../config');
  return getDirConfigs(defaultsDir);
};

/**
 * Returns the defined configs in /config/ dir
 *
 * @NOTE keys are assigned by filename in /config/ dir
 *
 * @return {object}
 */
var getDefinedConfigs = function getDefinedConfigs(configDir) {
  var _dir = utils.makePathFromRoot('config');
  if (configDir) {
    _dir = configDir;
  }

  return getDirConfigs(_dir);
};

/**
 * Return a hashmap of config files in a given directory
 * @param  {string} dir
 * @return {object}
 */
var getDirConfigs = function getDirConfigs(dir) {
  var hash = {};
  return modules.loadDirFilesAsModules(dir, hash);
};