declare function require(name : string);
var fs   = require('fs');

export function getContents(filename)
{
    var stat = fs.statSync(filename);
    var fd = fs.openSync(filename, "r");
    var bytes = fs.readSync(fd, stat.size, 0, "ascii");
    var contents = bytes[0];
    return contents;
}

