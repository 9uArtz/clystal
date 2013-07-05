/**
 * pool.js
 */
// ----[ Modules ]--------------------------------------------------------------
var Config    = require('../system/config');
var Exception = require('../system/exception');
var Util      = require('../util');
var mysql     = require('mysql');

// ----[ Fields ]---------------------------------------------------------------
var defaultSetting = {};
var initialized    = false;
var pool           = {}

// ----[ Functions ]------------------------------------------------------------
/**
 * get default setting
 *
 * @return  object
 */
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

/**
 * get setting by DSN and State
 *
 * @param   string
 * @param   string
 * @return  object
 */
function getSettingByDsnAndState(dsn, state)
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

/**
 * get connection
 *
 * @access  public
 * @param   string
 * @param   string
 * @return  object
 */
 function getConnection(dsn, state)
{
    var setting = getSettingByDsnAndState(dsn, state);
    var key     = JSON.stringify(setting);
    if (pool[key] == undefined) {
        pool[key] = mysql.createConnection(setting);
    }

    return pool[key];
}
exports.getConnection = getConnection;
