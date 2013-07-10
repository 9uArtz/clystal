/**
 * index.js
 */
require('./lib/extension');

// ----[ Modules ]--------------------------------------------------------------
var Config   = require('./class/system/config');
var File     = require('./class/system/file');
var Accessor = require('./class/accessor');

// ----[ Fields ]---------------------------------------------------------------
var accessors = {};

// ----[ Functions ]------------------------------------------------------------
/**
 * init
 *
 * @param   string
 * @param   string
 */
function init(configPath, base)
{
    var contents = File.getContents(configPath);
    var config   = JSON.parse(contents);
    Config.init(config, base);
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
