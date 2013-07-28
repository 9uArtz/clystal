/**
 * pool.js
 */
// ----[ Modules ]--------------------------------------------------------------
var config    = require('../system/config');
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
function getConnection(dsn, useDB)
{
    var option = getDSNOption(dsn);
    var key    = option.toJson();
    var conn   = pool.hasKey(key)
        ? pool[key]
        : pool[key] = mysql.createPool(option);
    var changeOption = {
        database : (useDB) ? option.database : null
    };

    return function(cb) {
        conn.getConnection(function(err, connection) {
            if (err) {
                cb(err);
            }
            connection.changeUser(changeOption, function(err) {
                cb(err, connection);
            });
        });
    }
}

/**
 * get dsn option
 *
 * @param   string
 * @return  object
 */
function getDSNOption(dsn)
{
    return config.get().dsn.mysql[dsn];
}
