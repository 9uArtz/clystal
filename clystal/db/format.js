var Exception = require('../system/exception');

var Format = function(format) {
    this.tableName = null;
    this.queries   = null;
    this.dsn       = null;
    for (var key in format) {
        this[key] = format[key];
    }
}
Format.prototype.getTableName = function() {
    return this.tableName;
}
Format.prototype.getQuery = function(query) {
    if (this.queries[query] == undefined) {
        throw new Exception(
            'undefined query',
            {query: query}
        );
    }

    return this.queries[query];
}
module.exports = Format;
