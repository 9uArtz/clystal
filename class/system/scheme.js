/**
 * scheme.js
 */
// ----[ Modules ]-------------------------------------------------------------
var Exception = require('./exception');
var Config    = require('./config');

// ----[ Constants ]------------------------------------------------------------
const EXTENSION       = '.js';
const ACCESSOR_SUFFIX = 'Accessor';
const SCHEME_REGEX    = /^[0-9a-z\/]$/

// ----[ Functions ]------------------------------------------------------------
module.exports = {
    getFormatPath : getFormatPath,
    getAccessorPath : getAccessorPath,
}

/**
 * get format path
 *
 * @param   string
 * @return  string
 */
function getFormatPath(scheme)
{
    checkScheme(scheme);
    return Config.get('base') + '/' + scheme + EXTENSION;
}

/**
 * get accessor path
 *
 * @param   string
 * @return  string
 */
function getAccessorPath(scheme)
{
    return Config.get('base') + '/' + scheme + ACCESSOR_SUFFIX + EXTENSION;
}

/**
 * check scheme format
 *
 * @param   string
 */
function checkScheme(scheme)
{
    if (!scheme.match) {
        throw new Exception(
            'invalid scheme name',
            scheme
        );
    }
}
