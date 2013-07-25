/**
 * format.js
 */
// ----[ Modules ]--------------------------------------------------------------
var Exception = require('../system/exception');

/**
 * Format
 */
var Format = (function() {
    /**
     * constructor
     *
     * @param   object
     */
    function Format(format) {
        this.tableName = null;
        this.queries   = null;
        this.dsn       = null;
        for (var key in format) {
            this[key] = format[key];
        }
    }

    /**
     * get table name
     *
     * @return  string
     */
    Format.prototype.getTableName = function() {
        return this.tableName;
    }

    /**
     * get DSN
     *
     * @return  string
     */
    Format.prototype.getDSN = function() {
        return this.dsn;
    }

    /**
     * get query
     *
     * @param   string
     * @return  string
     */
    Format.prototype.getQuery = function(query) {
        if (this.queries[query] == undefined) {
            throw new Exception(
                'undefined query',
                {query: query}
            );
        }
        return this.queries[query];
    }

    return Format;
})();
module.exports = Format;
