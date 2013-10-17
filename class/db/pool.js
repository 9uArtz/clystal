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
    var conn   = mysql.createPool(option);

    return function(cb) {
        conn.getConnection(function(err, connection) {
            if (err) {
                cb(err);
                return;
            }
            cb(err, connection);
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
