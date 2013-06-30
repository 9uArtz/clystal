var Exception = function(msg, context) {
    if (typeof context === 'undefined') { context = {} }
    this.msg     = msg;
    this.context = context;
}
module.exports = Exception;
