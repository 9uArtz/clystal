/**
 * accessor.js
 */
// ----[ Methods ]--------------------------------------------------------------
var Facade = require('./facade');
var Format = require('./db/format');
var Config = require('./system/config');

/**
 * Accessor
 */
var Accessor = (function() {
    function Accessor(schemeName) {
        // set format
        var path    = Config.get('base') + '/' + schemeName;
        var format  = require(path);
        this.format = new Format(format);

        // set facade method
        var ref = this;
        Facade.each(function(func, name) {
            ref[name] = function() {
                var params = [this.format];
                for (var argKey in arguments) {
                    params.push(arguments[argKey]);
                }
                return Facade[name].apply(null, params);
            };
        });
    }
    Facade.each(function(func, name) {
        Accessor.prototype[name] = function() {
            var params = [this.format];
            arguments.each(function (value) { params.push(value); });

            return Facade[name].apply(null, params);
        };
    });
    return Accessor;
})();
module.exports = Accessor;
