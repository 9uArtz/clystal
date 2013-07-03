/**
 * util.js
 */
// ----[ Functions ]------------------------------------------------------------
function random(from, to)
{
    return from + Math.floor(Math.random() * (to - from + 1));
}
exports.random = random;
