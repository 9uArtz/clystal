var config = {};
var initialized = false;

export function init(input : {
    default : {
        host : string;
        port : number;
        user : string;
        pass : string;
    };
}) {
    if (!initialized) {
        config = input;
        initialized = true;
    }
}

export function get(key : string);
export function get(key : string[]);
export function get(key : any)
{
    if (typeof(key) == 'string') {
        return (config[key] == undefined)
            ? null
            : config[key];
    } else {
        var current = config;
        for (var k in key) {
            if (current[key[k]] == undefined) {
                return null;
            } else {
                current = current[key[k]];
            }
        }

        return current;
    }
}

export function getAll()
{
    return config;
}
