import Format = module('format');

export = Criteria;
class Criteria { 
    // ----[ Constants ]--------------------------------------------------------
    /**
     * @const   EXEC TYPE
     */
    static TYPE_GET:       number = 1;
    static TYPE_MGET:      number = 2;
    static TYPE_FIND:      number = 3;
    static TYPE_FINDFIRST: number = 4;
    static TYPE_EXEC:      number = 5;

    // ----[ Properties ]-------------------------------------------------------
    /**
     * @var int
     */
    private type : number;

    /**
     * @var Format
     */
    private format : Format;

    /**
     * @var callback function
     */
    private callback : (err : any, rows : any, fileds : any) => any;

    /**
     * @var object
     */
    private params : {};

    /**
     * @var any
     */
    private hint : any;

    /**
     * @var boolean
     */
    private useMaster : boolean;

    // ----[ Methods ]----------------------------------------------------------
    /**
     * construtor
     *
     * @param   object
     */
    constructor(params: {
        type:      number;
        format:    Format;
        callback:  (err : any, rows : any, fields : any) => any;
        params:    any;
        hint:      any;
        useMaster: boolean;
    }) {
        this.type      = params.type;
        this.format    = params.format;
        this.callback  = params.callback;
        this.params    = params.params;
        this.hint      = params.hint;
        switch (this.type) {
        case Criteria.TYPE_EXEC:
            this.useMaster = true;
            break;
        default:
            this.useMaster = params.useMaster;
            break;
        }
    }

    /**
     * get type
     */
    public getType() : number
    {
        return this.type;
    }

    /**
     * get format
     */
    public getFormat() : Format
    {
        return this.format;
    }

    /**
     * get callback
     */
    public getCallback() : (err : any, rows : any, fields : any) => any
    {
        return this.callback;
    }

    /**
     * get params
     */
    public getParams() : {}
    {
        return this.params;
    }

    /**
     * get hint
     */
    public getHint() : any
    {
        return this.hint;
    }

    /**
     * get is use master
     */
    public isUseMaster() : boolean
    {
        return this.useMaster;
    }
}
