import Pool      = module('pool');
import Criteria  = module('criteria');
import Exception = module('system/exception');

export = Statement;
class Statement
{
    // ----[ Constants ]--------------------------------------------------------
    /**
     * @const   query format
     */
    static QUERY_FOR_GET  = 'SELECT * FROM __TABLE_NAME__ WHERE __CONDITION__';

    /**
     * @const   placeholder regex
     */
    static PLACEHOLDER_REGEX = /(:\w+)/g;

    // ----[ Methods ]----------------------------------------------------------
    /**
     * constructor
     *
     * @param   Criteria
     */
    constructor(private criteria : Criteria) {
    }

    /**
     * execute statement
     *
     * @return  mixed
     */
    public execute()
    {
        var connection     = this.getConnection();
        var query  :string = this.prepare();
        var params :any[]  = this.resolvePlaceHolder(query);
        params.push(this.criteria.getCallback());
        connection.query.apply(connection, params);
    }

    /**
     * get connection
     *
     * @return  object
     */
    private getConnection()
    {
        var state = (this.criteria.isUseMaster())
            ? 'master'
            : 'slave';
        return Pool.getConnection(this.criteria.getFormat().getDSN(), state);
    }

    /**
     * prepare
     *
     * @return  string
     */
    private prepare()
    {
        switch (this.criteria.getType())
        {
            case Criteria.TYPE_GET:
                return this.prepareForGet();
            default:
                throw new Exception(
                    'undefined criteria type',
                    {type: this.criteria.getType()}
                );
        }
    }

    /**
     * prepare for GET type
     *
     * @return  string
     */
    private prepareForGet() : string
    {
        var primaryKey = this.criteria.getFormat().getPrimaryKey();
        var condition  = null;
        if (primaryKey == null) {
            throw new Exception(
                'primary key is not exist',
                this.criteria.getFormat()
            )
        } else if (primaryKey == Array) {
            for (var key in primaryKey) {
                var cond = primaryKey[key] + ' = :' + primaryKey[key];
                condition = (condition == null)
                    ? cond
                    : cond + ' AND ' + condition;
            }
        } else {
            condition = primaryKey + ' = :' + primaryKey;
        }

        var tableName = this.criteria.getFormat().getTableName(
            this.criteria.getParams(),
            this.criteria.getHint()
        );
        return Statement.QUERY_FOR_GET
            .replace('__TABLE_NAME__', tableName)
            .replace('__CONDITION__', condition);
    }

    /**
     * resolve placeholder and get arguments
     *
     * @param   query
     * @return  Array
     */
    private resolvePlaceHolder(query : string) : any[]
    {
        var match  = null;
        var params = [query.replace(Statement.PLACEHOLDER_REGEX, '?')];
        while (match = Statement.PLACEHOLDER_REGEX.exec(query)) {
            var key = match[0].substring(1);
            if (this.criteria.getParams()[key] == undefined) {
                throw new Exception(
                    'required key does not exist for placeholder',
                    {key: key}
                );
            }
            params.push(this.criteria.getParams()[key]);
        }

        return params;
    }
}
