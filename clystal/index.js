/**
 * index.js
 */
require('../lib/extension');

// ----[ Modules ]--------------------------------------------------------------
var Config   = require('./system/config');
var File     = require('./system/file');
var Accessor = require('./accessor');

// ----[ Fields ]---------------------------------------------------------------
var accessors = {};

// ----[ Functions ]------------------------------------------------------------
/**
 * init
 *
 * @param   string
 */
function init(configPath)
{
    var contents = File.getContents(configPath);
    var config   = JSON.parse(contents);
    Config.init(config);
}
exports.init = init;

/**
 * get accessor
 *
 * @param   string
 */
function getAccessor(schemeName)
{
    if (accessors[schemeName] == undefined) {
        accessors[schemeName] = new Accessor(schemeName);
    }

    return accessors[schemeName];
}
exports.getAccessor = getAccessor;
