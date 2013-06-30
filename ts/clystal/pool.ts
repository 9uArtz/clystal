import Config    = module('system/config');
import Exception = module('system/exception');
import Util      = module('util');

declare function require(name : string);
var mysql  = require('mysql');
var defaultSetting  = {};
var initialized     = false;

var pool = {}
function getDefaultSetting()
{
    if (!initialized) {
        var states = ['master', 'slave', 'standby'];
        for (var key in states) {
            var state = states[key];
            defaultSetting[state] = {
                'host'     : Config.get('mysql.default.' + state),
                'user'     : Config.get('mysql.default.user'),
                'password' : Config.get('mysql.default.password'),
                'database' : Config.get('mysql.default.database'),
            };
        }
    }

    return defaultSetting;
}
function getSettingByDsnAndState(dsn : string, state : string)
{
    // new connection
    var dsnConfig = Config.get('mysql.' + dsn);
    if (dsnConfig == null) {
        throw new Exception('undefined dsn', {dsn: dsn});
    } else {
        dsnConfig = (dsnConfig[state] == undefined)
            ? {}
            : dsnConfig[state];
    }

    var setting = getDefaultSetting()[state];
    for (var key in dsnConfig) {
        setting[key] = dsnConfig[key];
    }
    if (typeof setting.host == 'object') {
        setting.host = setting.host[Util.random(0, setting.host.length - 1)];
    }

    return setting;
}

export function getConnection(dsn : string, state : string)
{
    var setting = getSettingByDsnAndState(dsn, state);
    var key     = JSON.stringify(setting);
    if (pool[key] == undefined) {
        pool[key] = mysql.createConnection(setting);
    }

    return pool[key];
}

