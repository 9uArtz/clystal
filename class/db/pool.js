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
 * get connection
 *
 * @param   string
 * @param   string
 * @return  object
 */
function getConnection(dsn, state)
{
    // new connection
    var dsnConfig = Config.get('mysql.' + dsn);
    if (dsnConfig == null) {
        throw new Exception('undefined dsn', {dsn: dsn});
    } else if (dsnConfig.hasKey(state)) {
        dsnConfig.host = dsnConfig[state];
    }

    var setting = getDefaultSetting()[state];
    dsnConfig.each(function(value, key) {
        setting[key] = value;
    });
    if (setting.host instanceof Array) {
        setting.host = setting.host[Util.random(0, setting.host.length - 1)];
    }

    var baseSetting = {
        host:     setting.host,
        user:     setting.user,
        password: setting.password,
    }
    var key  = baseSetting.toJson();
    var conn = pool.hasKey(key)
        ? pool[key]
        : pool[key] = mysql.createConnection(baseSetting);
    conn.changeUser({database: setting.database}, function(err) {
        if (err) throw err;
    });

    return conn;
}
exports.getConnection = getConnection;
