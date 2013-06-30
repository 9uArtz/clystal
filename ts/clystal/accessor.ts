declare function require(name : string);
import Format = module('format');
import Facade = module('facade');
import Config = module('system/config');

export = Accessor;
class Accessor
{
    // ----[ Properties ]-------------------------------------------------------
    /**
     * @var Format
     */
    private format : Format;

    // ----[ Methods ]----------------------------------------------------------
    /**
     * constructor
     *
     * @param   string
     */
    constructor(schemeName : string)
    {
        // set format
        var path    = Config.get('base') + '/' + schemeName;
        var format  = require(path);
        this.format = new Format(format);

        // set facade method
        for (var key in Facade) {
            this[key] = function() {
                var params = [this.format];
                for (var argKey in arguments) {
                    params.push(arguments[argKey]);
                }
                Facade[key].apply(null, params);
            }
        }
    }
}
