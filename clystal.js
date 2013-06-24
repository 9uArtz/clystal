var file = require('./clystal/system/file')
var config = require('./clystal/system/config')
function init(config_path) {
    var mysql_config = JSON.parse(file.getContents(config_path));
    config.init(mysql_config);
}
exports.init = init;
