var Format = (function () {
    function Format() {
        this.table_name = null;
        this.primary_key = null;
        this.dsn = null;
        this.queries = {
        };
    }
    Format.prototype.getTableName = function () {
        return this.table_name;
    };
    return Format;
})();
exports.Format = Format;
