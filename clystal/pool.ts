import config    = module('system/config');
import exception = module('system/exception');
declare function require(name : string);
var mysql = require('mysql');
var default_setting = {
    master : config.get(['default', 'master']),
};

var pool = {}

export function getConnection(dsn : string, state : string)
{
    if (pool[dsn] == undefined || pool[dsn][state] == undefined) {

        // new connection
        var dsn_config = config.get(dsn);
        if (dsn_config == null) {
            throw exception.create('undefined dsn', {dsn: dsn});
        } else {
            dsn_config = (dsn_config[state] == undefined)
                ? {}
                : dsn_config[state];
        }

        var setting = default_setting[state];
        for (var key in dsn_config) {
            setting[key] = dsn_config[key];
        }

        // set pool
        if (pool[dsn] == undefined) {
            pool[dsn] = {};
        }
        pool[dsn][state] = mysql.createPool(setting);
    }

    return pool[dsn][state];
}
