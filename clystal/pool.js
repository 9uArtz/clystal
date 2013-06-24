var config = require('./system/config')
var exception = require('./system/exception')
var mysql = require('mysql');
var default_setting = {
    master: config.get([
        'default', 
        'master'
    ])
};
var pool = {
};
function getConnection(dsn, state) {
    if(pool[dsn] == undefined || pool[dsn][state] == undefined) {
        var dsn_config = config.get(dsn);
        if(dsn_config == null) {
            throw exception.create('undefined dsn', {
                dsn: dsn
            });
        } else {
            dsn_config = (dsn_config[state] == undefined) ? {
            } : dsn_config[state];
        }
        var setting = default_setting[state];
        for(var key in dsn_config) {
            setting[key] = dsn_config[key];
        }
        if(pool[dsn] == undefined) {
            pool[dsn] = {
            };
        }
        pool[dsn][state] = mysql.createPool(setting);
    }
    return pool[dsn][state];
}
exports.getConnection = getConnection;
