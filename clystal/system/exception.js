/**
 * exception.js
 */

/**
 * Exception
 */
var Exception = (function() {
    var Exception = function(msg, context) {
        if (context === undefined) { context = {} }
        this.msg     = msg;
        this.context = context;
    }
    return Exception;
})();
module.exports = Exception;
