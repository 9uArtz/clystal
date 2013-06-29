var config = {};
var initialized = false;

export function init(input : {
    base: string;
    mysql: {
        default : {
            master : string;
            slave  : Array;
            host   : string;
            port   : number;
            user   : string;
            pass   : string;
        };
    };
}) {
    if (!initialized) {
        config = input;
        initialized = true;
    }
}

export function get(key : string)
{
    if (key.indexOf('.') === -1) {
        return (config[key] != undefined)
            ? config[key]
            : null;
    }

    var keys    = key.split(".");
    var current = config;
    for (var k in keys) {
        if (current[keys[k]] == undefined) {
            return null;
        } else {
            current = current[keys[k]];
        }
    }

    return current;
}

export function getAll()
{
    return config;
}
