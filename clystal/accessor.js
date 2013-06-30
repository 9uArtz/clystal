var Facade = require('./facade');
var Format = require('./db/format');
var Config = require('./system/config');

var Accessor = function(schemeName) {
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
module.exports = Accessor;
