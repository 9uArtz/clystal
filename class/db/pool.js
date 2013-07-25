/**
 * pool.js
 */
// ----[ Modules ]--------------------------------------------------------------
var Config    = require('../system/config');
var Exception = require('../system/exception');
var Util      = require('../util');
var mysql     = require('mysql');

// ----[ Fields ]---------------------------------------------------------------
var pool = {}

// ----[ Functions ]------------------------------------------------------------
module.exports = {
    getConnection : getConnection,
    getDSNOption  : getDSNOption,
}

/**
 * get connection
 *
 * @param   string
 * @param   string
 * @param   bool    [optional] flag to use db
 * @return  object
 */
function getConnection(dsn, state, useDB)
{
    var option = getDSNOption(dsn);
    option.host = (option[state] instanceof Array)
        ? option[state][Util.random(0, option[state].length - 1)]
        : option[state];

    var baseOption = {
        host:     option.host,
        user:     option.user,
        password: option.password,
    }
    var key  = baseOption.toJson();
    var conn = pool.hasKey(key)
        ? pool[key]
        : pool[key] = mysql.createConnection(baseOption);
    var changeOption = {
        database : (useDB) ? option.database : null
    };
    conn.changeUser(changeOption, function(err) {
        if (err) throw err;
    });

    return conn;
}

/**
 * get dsn option
 *
 * @param   string
 * @return  object
 */
function getDSNOption(dsn)
{
    var dsnOption = Config.get('mysql.' + dsn);
    if (dsnOption === null) {
        throw new Exception('undefined dsn', {dsn: dsn});
    }

    var ret = Config.get('mysql.default');
    dsnOption.each(function(value, key) {
        ret[key] = value;
    });

    return ret;
}
