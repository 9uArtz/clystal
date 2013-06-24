

function get(scheme_name, key, hint, use_master) {
    if (typeof hint === "undefined") { hint = null; }
    if (typeof use_master === "undefined") { use_master = false; }
    var criteria = criteria.create({
        type: criteria.Type.GET,
        scheme_name: scheme_name,
        params: key,
        hint: hint,
        use_master: use_master
    });
    var stmt = statement.create(criteria);
    return stmt.execute();
}
exports.get = get;
