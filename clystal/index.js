var Config   = require('./system/config');
var File     = require('./system/file');
var Accessor = require('./accessor');

var accessors = {};

exports.init = function(configPath)
{
    var contents = File.getContents(configPath);
    var config   = JSON.parse(contents);
    Config.init(config);

    return this;
}

exports.getAccessor = function(schemeName)
{
    if (accessors[schemeName] == undefined) {
        accessors[schemeName] = new Accessor(schemeName);
    }

    return accessors[schemeName];
}
