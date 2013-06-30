var config = {};
var initialized = false;

module.exports = {
    init : function(input) {
        if (!initialized) {
            config = input;
            initialized = true;
        }
    },
    get : function(key) {
        if (key.indexOf('.') === -1) {
            return (config[key] != undefined)
                ? config[key]
                : null;
        }

        var keys    = key.split(".");
        var current = config;
        for (var k in keys) {
            if (current[keys[k]] == undefined) {
                return null;
            } else {
                current = current[keys[k]];
            }
        }

        return current;
    },
    getAll : function() {
        return config;
    }
}
