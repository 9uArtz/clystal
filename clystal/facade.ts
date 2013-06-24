import criteria  = module('./criteria');
import statement = module('./statement');

// ----[ Methods ]--------------------------------------------------------------
/**
 * get a record by primary key
 */
export function get(
    scheme_name : string,
    key         : string,
    hint        : any     = null,
    use_master  : boolean = false
) {
    var criteria = criteria.create({
        type        : criteria.Type.GET,
        scheme_name : scheme_name,
        params      : key,
        hint        : hint,
        use_master  : use_master
    });
    var stmt = statement.create(criteria);

    return stmt.execute();
}
