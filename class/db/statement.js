/**
 * statement.js
 */
// ----[ Modules ]--------------------------------------------------------------
var Criteria  = require('./criteria');
var Pool      = require('./pool');
var Exception = require('../system/exception');

// ----[ Constants ]------------------------------------------------------------
const QUERY_FOR_GET     = 'SELECT * FROM __TABLE_NAME__ WHERE __CONDITION__';
const QUERY_FOR_MGET    = 'SELECT * FROM __TABLE_NAME__ WHERE (__KEY__) IN (:cardinal_key__CARDINAL_KEY__)';
const PLACEHOLDER_REGEX = /(:\w+)(<(.*)>)?/;

// ----[ Functions ]------------------------------------------------------------
/**
 * wrap callback
 *
 * @param   Function
 * @param   int
 * @return  Function
 */
function wrapCallback(callback, type)
{
    return function(err, rows, fields) {
        if (err) {
            throw err;
        }
        switch (type) {
            case Criteria.TYPE_GET:
            case Criteria.TYPE_FINDFIRST:
                if (rows.length === 0) {
                    callback(null);
                } else {
                    callback(rows.shift());
                }
                break;
            default:
                callback(rows);
                break;
        }
    }
}

/**
 * Statement
 */
var Statement = (function() {
    /**
     * constructor
     *
     * @param   object
     */
    function Statement(criteria) {
        this.criteria = criteria;
    }

    /**
     * setup
     *
     * @access  public
     * @return  Statement
     */
    Statement.prototype.setup = function() {
        var connection = this.getConnection();
        var query      = this.prepare();
        var params     = this.resolvePlaceHolder(query);
        var type       = this.criteria.type;

        return function (callback) {
            params.push(wrapCallback(callback, type));
            connection.query.apply(connection, params);
        };
    }

    /*/**
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
        var query;
        switch (this.criteria.type) {
            case Criteria.TYPE_GET:
                query = this.prepareForGet();
                break;
            case Criteria.TYPE_MGET:
                query = this.prepareForMultiGet();
                break;
            case Criteria.TYPE_FIND:
            case Criteria.TYPE_FINDFIRST:
            case Criteria.TYPE_EXEC:
                query = this.prepareForCommon();
                break;
            default:
                throw new Exception(
                    'undefined criteria type',
                    {type: this.criteria.type}
                );
        }
        var limit = null;
        switch (this.criteria.type) {
            case Criteria.TYPE_GET:
            case Criteria.TYPE_FINDFIRST:
                limit = 1;
                break;
            default:
                limit = this.criteria.limit;
        }
        if (limit) {
            query = query + ' LIMIT ' + limit;
            if (this.criteria.offset) {
                query = query + ' OFFSET ' + this.criteria.offset;
            }
        }

        return query;
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
     * prepare for common type
     *
     * @return  string
     */
    Statement.prototype.prepareForCommon = function() {
        var tableName = this.criteria.format.getTableName(
            this.criteria.params,
            this.criteria.hint
        );
        return this.criteria.format
            .getQuery(this.criteria.query)
            .replaceAll('__TABLE_NAME__', tableName);
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
                var param   = [];
                value.each(function(v) {
                    var p = [];
                    keys.each(function(k) {
                        if (v.hasKey(k)) {
                            p.push(v[k])
                        } else {
                            throw new Exception(
                                'required key does not exist for placeholder',
                                {key: k}
                            );
                        }
                    });
                    param.push(p);
                });
                values.push(param);
                query = query.replace(PLACEHOLDER_REGEX, '?');
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

    return Statement;
})();
module.exports = Statement;

