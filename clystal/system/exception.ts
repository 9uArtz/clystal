export = Exception;
class Exception
{
    constructor(
        public msg     : string,
        public context : {} = {}
    ) {
    }
}
