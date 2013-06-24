var config = {
};
var initialized = false;
function init(input) {
    if(!initialized) {
        config = input;
        initialized = true;
    }
}
exports.init = init;
function get(key) {
    if(typeof (key) == 'string') {
        return (config[key] == undefined) ? null : config[key];
    } else {
        var current = config;
        for(var k in key) {
            if(current[key[k]] == undefined) {
                return null;
            } else {
                current = current[key[k]];
            }
        }
        return current;
    }
}
exports.get = get;
function getAll() {
    return config;
}
exports.getAll = getAll;
