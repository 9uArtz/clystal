import Format    = module('format');
import Criteria  = module('criteria');
import Statement = module('statement');

// ----[ Methods ]--------------------------------------------------------------
/**
 * get a record by primary key
 */
export function get(
    format    : Format,
    callback  : (err : any, rows : any, fields : any) => any,
    key       : any,
    hint      : any     = null,
    useMaster : boolean = false
) {
    var params = {};
    if (typeof key != 'object') {
        params[format.getPrimaryKey()] = key;
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

    return stmt.execute();
}
