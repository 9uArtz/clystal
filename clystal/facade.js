var Format    = require('./db/format');
var Criteria  = require('./db/criteria');
var Statement = require('./db/statement');

module.exports = {
    /**
     * get by primary key
     *
     * @param   Format
     * @param   Function
     * @param   any
     * @param   any
     * @param   bool
     */
    get : function(format, callback, key, hint, useMaster) {
        if (typeof hint      === 'undefined') { hint      = null; }
        if (typeof useMaster === 'undefined') { useMaster = false; }
        var criteria = new Criteria({
            type      : Criteria.TYPE_GET,
            format    : format,
            callback  : callback,
            params    : key,
            hint      : hint,
            useMaster : useMaster,
        });
        var stmt = new Statement(criteria);

        stmt.execute();
    },
    /**
     * multi get by primary keys
     *
     * @param   Format
     * @param   Function
     * @param   any
     * @param   any
     * @param   bool
     */
    mget : function(format, callback, keys, hint, useMaster) {
        if (typeof hint      === 'undefined') { hint      = null; }
        if (typeof useMaster === 'undefined') { useMaster = false; }
        var criteria = new Criteria({
            type      : Criteria.TYPE_MGET,
            format    : format,
            callback  : callback,
            params    : keys,
            hint      : hint,
            useMaster : useMaster,
        });
        var stmt = new Statement(criteria);

        stmt.execute();
    },
}
