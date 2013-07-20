/**
 * accessor.js
 */
var fs     = require('fs');
var facade = require('./facade');
var scheme = require('./system/scheme');
var Format = require('./db/format');

// ----[ Methods ]--------------------------------------------------------------

/**
 * Accessor
 */
var Accessor = (function() {

    /**
     * Accessor
     */
    function Accessor(format) {
        this.format = format;
    }

    /**
     * call facade
     *
     * @param   string  call name
     * @param   ...
     * @return
     */
    Accessor.prototype.callFacade = function() {
        var args = [];
        arguments.each(function(param) {
            args.push(param);
        });
        var name = args.shift();
        args.unshift(this.format);
        return facade[name].apply(null, args);
    }

    // set facade function
    Object.keys(facade).each(function(name) {
        Accessor.prototype[name] = function() {
            var args = [name];
            arguments.each(function(param) {
                args.push(param);
            });
            return this.callFacade.apply(this, args);
        };
    });
    return Accessor;
})();
module.exports = Accessor;
