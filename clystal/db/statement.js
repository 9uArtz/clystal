var Criteria  = require('./criteria');
var Pool      = require('./pool');
var Exception = require('../system/exception');

const QUERY_FOR_GET  = 'SELECT * FROM __TABLE_NAME__ WHERE __CONDITION__';
const QUERY_FOR_MGET = 'SELECT * FROM __TABLE_NAME__ WHERE (__KEY__) IN (:cardinal_key__CARDINAL_KEY__)';
const PLACEHOLDER_REGEX = /(:\w+)(<(.*)>)?/;

var Statement = function(criteria) {
    this.criteria = criteria;
}
module.exports = Statement;

/**
 * execute
 *
 * @access  public
 */
Statement.prototype.execute = function() {
    var connection = this.getConnection();
    var query      = this.prepare();
    var params     = this.resolvePlaceHolder(query);
    params.push(this.getCallback());
    connection.query.apply(connection, params);
}

/**
 * get connection
 *
 * @return  object
 */
Statement.prototype.getConnection = function() {
    var state = (this.criteria.useMaster)
        ? 'master'
        : 'slave';
    return Pool.getConnection(this.criteria.format.dsn, state);
}

/**
 * prepare query
 *
 * @return  string
 */
Statement.prototype.prepare = function() {
    switch (this.criteria.type) {
        case Criteria.TYPE_GET:
            return this.prepareForGet();
        case Criteria.TYPE_MGET:
            return this.prepareForMultiGet();
        default:
            throw new Exception(
                'undefined criteria type',
                {type: this.criteria.type}
            );
    }
}
/**
 * prepare query for GET
 *
 * @return  string
 */
Statement.prototype.prepareForGet = function() {
    var condition  = null;
    if (this.criteria.format.primaryKey == null) {
        throw new Exception(
            'primary key is not exist',
            this.criteria.format
        );
    }
    var primaryKey = (this.criteria.format.primaryKey instanceof Array)
        ?  this.criteria.format.primaryKey
        : [this.criteria.format.primaryKey];
    var condition = primaryKey.map(function(key) {
        return key + ' = :' + key;
    }).join(' AND ');
    var tableName = this.criteria.format.getTableName(
        this.criteria.params,
        this.criteria.hint
    );

    return QUERY_FOR_GET
        .replaceAll('__TABLE_NAME__', tableName)
        .replaceAll('__CONDITION__', condition);
}

/**
 * prepare query for MGET
 *
 * @return  string
 */
Statement.prototype.prepareForMultiGet = function() {
    var condition  = null;
    if (this.criteria.format.primaryKey == null) {
        throw new Exception(
            'primary key is not exist',
            this.criteria.format
        );
    }
    var key;
    var cardinalKey;
    if (this.criteria.format.primaryKey instanceof Array) {
        key = this.criteria.format.primaryKey.join(', ');
        cardinalKey = '<' + key + '>';
    } else {
        key = this.criteria.format.primaryKey;
        cardinalKey = '';
    }
    var tableName = this.criteria.format.getTableName(
        this.criteria.params,
        this.criteria.hint
    );
    var cardinalKey = (this.criteria.format.primaryKey instanceof Array)
        ? '<' + key + '>'
        : '';

    return QUERY_FOR_MGET
        .replaceAll('__TABLE_NAME__', tableName)
        .replaceAll('__KEY__', key)
        .replaceAll('__CARDINAL_KEY__', cardinalKey);
}

/**
 * get callback
 *
 * @return  Function
 */
Statement.prototype.getCallback = function() {
    switch (this.criteria.type) {
        case Criteria.TYPE_GET:
            return this.getCallbackForRow();
        case Criteria.TYPE_MGET:
            return this.getCallbackForRows();
        default:
            throw new Exception(
                'undefined criteria type',
                {type: this.criteria.type}
            );
    }
}

/**
 * get callback for single row
 *
 * @return  Function
 */
Statement.prototype.getCallbackForRow = function()
{
    var callback = this.criteria.callback;
    return function(err, rows, fields) {
        if (err) {
            throw err;
        }
        if (rows.length === 0) {
            return callback(null);
        } else {
            return callback(rows.shift());
        }
    }
}

/**
 * get callback for multi rows
 *
 * @return  Function
 */
Statement.prototype.getCallbackForRows = function()
{
    var callback = this.criteria.callback;
    return function(err, rows, fields) {
        if (err) {
            throw err;
        }
        callback(rows);
    }
}

/**
 * resolve placeholder
 *
 * @return  Array
 */
Statement.prototype.resolvePlaceHolder = function(query)
{
    var params = this.getParamsForType();
    var match  = null;
    var ret    = [];
    var values = [];
    while (match = PLACEHOLDER_REGEX.exec(query)) {
        if (match[3] === undefined) {
            var key   = match[1].substring(1);
            var value = params[key];
            if (value === undefined) {
                throw new Exception(
                    'required key does not exist for placeholder',
                    {key: key}
                );
            } else if (value instanceof Array) {
                value.each(function(v) { values.push(v); });
                var length  = value.length;
                var replace = [];
                for (var i = 0; i < length; i ++) {
                    replace.push('?');
                }
                query = query.replace(PLACEHOLDER_REGEX, replace.join(', '));
            } else {
                values.push(value);
                query = query.replace(PLACEHOLDER_REGEX, '?');
            }
        } else {
            // multi columns list
            var key     = match[1].substring(1);
            var value   = params[key];
            if (value === undefined) {
                throw new Exception(
                    'required key does not exist for placeholder',
                    {key: key}
                );
            }
            var keys    = match[3].replace(/\s+/g, '').split(',');
            var replace = [];
            value.each(function(v) {
                var r = [];
                keys.each(function(k) {
                    values.push(v[k])
                    r.push('?');
                });
                replace.push('(' + r.join(', ') + ')');
            });
            query = query.replace(PLACEHOLDER_REGEX, replace.join(', '));
        }
    }

    ret.push(query.replace(PLACEHOLDER_REGEX, '?'));
    ret.push(values);

    return ret;
}

/**
 * modify params by type
 *
 * @return  any
 */
Statement.prototype.getParamsForType = function()
{
    switch (this.criteria.type) {
        case Criteria.TYPE_GET:
            var params = {};
            if (this.criteria.format.primaryKey instanceof Array) {
                params = this.criteria.params;
            } else {
                params[this.criteria.format.primaryKey] = this.criteria.params;
            }
            return params;

        case Criteria.TYPE_MGET:
            return {cardinal_key : this.criteria.params};

        default:
            return this.criteria.params;
    }
}
