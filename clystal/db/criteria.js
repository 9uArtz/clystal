/**
 * criteria.js
 */
// ----[ Modules ]--------------------------------------------------------------
var Format = require('./format');

/**
 * Criteria
 */
var Criteria = (function() {
    /**
     * constructor
     *
     * @param   object
     */
    function Criteria(params) {
        this.type     = params.type;
        this.format   = params.format;
        this.query    = params.query;
        this.params   = params.params;
        this.offset   = params.offset;
        this.limit    = params.limit;
        this.hint     = params.hint;
        switch (this.type) {
        case Criteria.TYPE_EXEC:
            this.useMaster = true;
            break;
        default:
            this.useMaster = params.useMaster;
            break;
        }
    }
    Criteria.TYPE_GET       = 1;
    Criteria.TYPE_MGET      = 2;
    Criteria.TYPE_FIND      = 3;
    Criteria.TYPE_FINDFIRST = 4;
    Criteria.TYPE_EXEC      = 5;

    return Criteria;
})();
module.exports = Criteria;
