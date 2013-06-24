export class Format
{
    // ----[ Properties ]-------------------------------------------------------
    /**
     * table name
     */
    table_name : string = null;

    /**
     * primary key
     */
    primary_key : any = null;

    /**
     * dns name
     */
    dsn : string = null;

    /**
     * query
     */
    queries : {} = {};

    /**
     * get table name by criteria
     */
    getTableName() : string {
        return this.table_name;
    }
}
