var Criteria  = require('./criteria');
var Pool      = require('./pool');
var Exception = require('../system/exception');

const QUERY_FOR_GET = 'SELECT * FROM __TABLE_NAME__ WHERE __CONDITION__';
const PLACEHOLDER_REGEX = /(:\w+)/g;

var Statement = function(criteria) {
    this.criteria = criteria;
}
Statement.prototype.execute = function() {
    var connection = this.getConnection();
    var query      = this.prepare();
    var params     = this.resolvePlaceHolder(query);
    params.push(this.criteria.callback);
    connection.query.apply(connection, params);
}
Statement.prototype.getConnection = function() {
    var state = (this.criteria.useMaster)
        ? 'master'
        : 'slave';
    return Pool.getConnection(this.criteria.format.dsn, state);
}
Statement.prototype.prepare = function() {
    switch (this.criteria.type)
    {
        case Criteria.TYPE_GET:
            return this.prepareForGet();
        default:
            throw new Exception(
                'undefined criteria type',
                {type: this.criteria.type}
            );
    }
}
Statement.prototype.prepareForGet = function() {
    var primaryKey = this.criteria.format.primaryKey;
    var condition  = null;
    if (primaryKey == null) {
        throw new Exception(
            'primary key is not exist',
            this.criteria.format
        )
    } else if (primaryKey == Array) {
        for (var key in primaryKey) {
            var cond = primaryKey[key] + ' = :' + primaryKey[key];
            condition = (condition == null)
                ? cond
                : cond + ' AND ' + condition;
        }
    } else {
        condition = primaryKey + ' = :' + primaryKey;
    }

    var tableName = this.criteria.format.getTableName(
        this.criteria.params,
        this.criteria.hint
    );
    return QUERY_FOR_GET
        .replace('__TABLE_NAME__', tableName)
        .replace('__CONDITION__', condition);
}
Statement.prototype.resolvePlaceHolder = function(query)
{
    var match  = null;
    var params = [query.replace(PLACEHOLDER_REGEX, '?')];
    while (match = PLACEHOLDER_REGEX.exec(query)) {
        var key = match[0].substring(1);
        if (this.criteria.params[key] == undefined) {
            throw new Exception(
                'required key does not exist for placeholder',
                {key: key}
            );
        }
        params.push(this.criteria.params[key]);
    }

    return params;
}
module.exports = Statement;
