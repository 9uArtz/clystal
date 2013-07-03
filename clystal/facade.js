var Format    = require('./db/format');
var Criteria  = require('./db/criteria');
var Statement = require('./db/statement');

module.exports = {
    /**
     * get by primary key
     *
     * @param   Format
     * @param   any
     * @param   any
     * @param   bool
     */
    get : function(format, key, hint, useMaster) {
        if (hint      === undefined) { hint      = null; }
        if (useMaster === undefined) { useMaster = false; }
        var criteria = new Criteria({
            type      : Criteria.TYPE_GET,
            format    : format,
            params    : key,
            hint      : hint,
            useMaster : useMaster,
        });
        var stmt = new Statement(criteria);

        return stmt.setup();
    },

    /**
     * multi get by primary keys
     *
     * @param   Format
     * @param   any
     * @param   any
     * @param   bool
     */
    mget : function(format, keys, hint, useMaster) {
        if (hint      === undefined) { hint      = null; }
        if (useMaster === undefined) { useMaster = false; }
        var criteria = new Criteria({
            type      : Criteria.TYPE_MGET,
            format    : format,
            params    : keys,
            hint      : hint,
            useMaster : useMaster,
        });
        var stmt = new Statement(criteria);

        return stmt.setup();
    },

    /**
     * find by params
     *
     * @param   Format
     * @param   string
     * @param   any
     * @param   int
     * @param   int
     * @param   any
     * @param   bool
     */
    find : function(
        format,
        query,
        params,
        offset,
        limit,
        hint,
        useMaster
    ) {
        if (offset    === undefined) { offset    = 0; }
        if (limit     === undefined) { limit     = null; }
        if (hint      === undefined) { hint      = null; }
        if (useMaster === undefined) { useMaster = false; }
        var criteria = new Criteria({
            type      : Criteria.TYPE_FIND,
            format    : format,
            query     : query,
            params    : params,
            offset    : offset,
            limit     : limit,
            hint      : hint,
            useMaster : useMaster,
        });
        var stmt = new Statement(criteria);

        return stmt.setup();
    },

    /**
     * find first by params
     *
     * @param   Format
     * @param   string
     * @param   any
     * @param   any
     * @param   bool
     */
    findFirst : function(format, query, params, hint, useMaster) {
        if (hint      === undefined) { hint      = null; }
        if (useMaster === undefined) { useMaster = false; }
        var criteria = new Criteria({
            type      : Criteria.TYPE_FINDFIRST,
            format    : format,
            query     : query,
            params    : params,
            hint      : hint,
            useMaster : useMaster,
        });
        var stmt = new Statement(criteria);

        return stmt.setup();
    },

    /**
     * execute by params
     *
     * @param   Format
     * @param   string
     * @param   any
     * @param   any
     */
    execute : function(format, query, params, hint) {
        if (hint === undefined) { hint = null; }
        var criteria = new Criteria({
            type      : Criteria.TYPE_EXEC,
            format    : format,
            query     : query,
            params    : params,
            hint      : hint,
        });
        var stmt = new Statement(criteria);

        return stmt.setup();
    },
}
