/**
 * index.js
 */
require('./lib/extension');

// ----[ Modules ]--------------------------------------------------------------
var fs       = require('fs');
var Scheme   = require('./class/system/scheme');
var Config   = require('./class/system/config');
var Accessor = require('./class/accessor');
var Format   = require('./class/db/format');

// ----[ Functions ]------------------------------------------------------------
/**
 * Clystal
 */
var Clystal = (function() {
    var accessors   = {};
    var initialized = false;

    /**
     * Clystal
     */
    function Clystal() {}

    /**
     * init
     *
     * @param   object
     * @return  object
     */
    Clystal.prototype.init = function(config) {
        Config.init(config);
        initialized = true;
        return clystal;
    }

    /**
     * get accessor
     *
     * @param   string
     */
    Clystal.prototype.getAccessor = function(schemeName) {
        if (!initialized) {
            throw new Exception('clystal has not been initialized');
        }
        if (accessors[schemeName] == undefined) {
            var formatParams = require(Scheme.getFormatPath(schemeName));
            var format       = new Format(formatParams);
            var accessorPath = Scheme.getAccessorPath(schemeName);
            if (fs.existsSync(accessorPath)) {
                var CustomAccessor = require(accessorPath);
                accessors[schemeName] = new CustomAccessor(format);
            } else {
                accessors[schemeName] = new Accessor(format);
            }
        }

        return accessors[schemeName];
    }

    /**
     * accessor
     */
    Clystal.prototype.accessor = Accessor;

    return Clystal;
})();
var clystal = new Clystal();

// ----[ Exports ]--------------------------------------------------------------
module.exports = clystal;
