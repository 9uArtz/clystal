import Config   = module('clystal/system/config');
import File     = module('clystal/system/file');
import Accessor = module('clystal/accessor');

var accessors = {};

export function init(configPath : string)
{
    var contents = File.getContents(configPath);
    var config   = JSON.parse(contents);
    Config.init(config);

    return this;
}

export function getAccessor(schemeName : string)
{
    if (accessors[schemeName] == undefined) {
        accessors[schemeName] = new Accessor(schemeName);
    }

    return accessors[schemeName];
}
