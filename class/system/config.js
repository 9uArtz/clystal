/**
 * config.js
 */
// ---[ Fields ]----------------------------------------------------------------
var config = {};
var initialized = false;

// ---[ Functions ]-------------------------------------------------------------
/**
 * init
 *
 * @param   object
 */
function init(input, base)
{
    if (!initialized) {
        input.base = base;
        config = input;
        initialized = true;
    }
}
exports.init = init;

/**
 * get
 *
 * @param   string
 * @return  any
 */
function get(key)
{
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
}
exports.get = get;

/**
 * get all config
 *
 * @return  object
 */
function getAll()
{
    return config;
}
exports.getAll = getAll;
