import Exception = module('system/exception');

export = Format;
class Format
{
    // ----[ Properties ]-------------------------------------------------------
    /**
     * @var string
     */
    private tableName : string = null;

    /**
     * @var any
     */
    private primaryKey : any = null;

    /**
     * @var string
     */
    private dsn : string = null;

    /**
     * @var object
     */
    private queries : {} = {};

    // ----[ Methods ]----------------------------------------------------------
    /**
     * constructor
     *
     * @param   format
     */
    constructor(format : {})
    {
        for (var key in format) {
            this[key] = format[key];
        }
    }

    /**
     * get table name
     *
     * @param   object
     * @param   any
     * @return  string
     */
    public getTableName(params : {}, hint : any) : string
    {
        return this.tableName;
    }

    /**
     * get primary key
     *
     * @return  any
     */
    public getPrimaryKey() : any
    {
        return this.primaryKey;
    }

    /**
     * getDSN
     *
     * @return  string
     */
    public getDSN() : string
    {
        return this.dsn;
    }

    /**
     * getQuery
     *
     * @param   string
     * @return  string
     */
    public getQuery(query : string) : string
    {
        if (this.queries[query] == undefined) {
            throw new Exception(
                'undefined query',
                {query: query}
            );
        }

        return this.queries[query];
    }
}
