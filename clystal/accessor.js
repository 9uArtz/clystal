var Facade = require('./facade');
var Format = require('./db/format');
var Config = require('./system/config');

var Accessor = function(schemeName) {
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
            Facade[name].apply(null, params);
        };
    });
}
module.exports = Accessor;
