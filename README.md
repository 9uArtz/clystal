clystal
=======

# sample.js
var Clystal = require('/path/to/clystal');
Clystal.init('/path/to/config.json');
Clystal
    .getAccessor('User')
    .find(
        'find_by_name',
        {name:"jooohn"},
        2,  // offset
        3,  // limit
    ).(function(rows) {
        console.log(rows);
    });

# config.json
{
    "base": "/path/to/format/dir",
    "mysql": {
        "default" : {
            "master"   : "localhost",
            "slave"    : ["localhost"],
            "standby"  : "localhost",
            "user"     : "root",
            "password" : "gree",
            "database" : "tig_main"
        },
        "tig_main" : {}
    }
}

# /path/to/format/dir/user.js
module.exports = {
    tableName: "user",
    primaryKey: "id",
    dsn: "tig_main",
    queries: {
        insert: "INSERT INTO __TABLE_NAME__ ( name,   pass,  ctime) VALUES (:name,  :pass,  NOW())",
        find_by_name : "SELECT * FROM __TABLE_NAME__ WHERE name = :name",
    }
}
