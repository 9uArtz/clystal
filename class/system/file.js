/**
 * file.js
 */

// ----[ Modules ]--------------------------------------------------------------
var fs = require('fs');

// ----[ Functions ]------------------------------------------------------------
/**
 * get contents of file
 *
 * @param   string
 * @return  string
 */
function getContents(fileName)
{
    var stat = fs.statSync(fileName);
    var fd = fs.openSync(fileName, "r");
    var bytes = fs.readSync(fd, stat.size, 0, "ascii");
    var contents = bytes[0];
    return contents;
}
exports.getContents = getContents;
