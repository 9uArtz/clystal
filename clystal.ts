import file   = module('clystal/system/file');
import config = module('clystal/system/config');

export function init(config_path : string)
{
    var mysql_config = JSON.parse(file.getContents(config_path));
    config.init(mysql_config);
}
