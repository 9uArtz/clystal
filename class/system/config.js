/**
 * config.js
 */
// ---[ Fields ]----------------------------------------------------------------
var conf = {};
module.exports = {
    init: function(input) { conf = input; },
    get: function() { return conf; }
}
