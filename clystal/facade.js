var Format    = require('./db/format');
var Criteria  = require('./db/criteria');
var Statement = require('./db/statement');

module.exports = {
    get : function(format, callback, key, hint, useMaster) {
        if (typeof hint === 'undefined')      { hint = null; }
        if (typeof useMaster === 'undefined') {useMaster = false; }
        var params = {};
        if (typeof key !== 'object') {
            params[format.primaryKey] = key;
        } else {
            params = key;
        }
        var criteria = new Criteria({
            type      : Criteria.TYPE_GET,
            format    : format,
            callback  : callback,
            params    : params,
            hint      : hint,
            useMaster : useMaster,
        });
        var stmt = new Statement(criteria);

        stmt.execute();
    },
}
