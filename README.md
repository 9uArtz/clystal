clystal
=======
# How to use

### sample.js
```javascript
// read config
var config  = require('/path/to/config.ini.js');
var clystal = require('/path/to/clystal').init(config);

// almost same interface as Cascade

// get by primary key
var userId = 1;
clystal.getAccessor('user').get(userId)(function(user) {
    // callback
    console.log(user);
});

// get by primary keys
var userIds = [1, 2, 3, 4];
clystal.getAccessor('user').mget(userIds)(function(users) {
    // callback
    console.log(users);
});

// find first row by query
var name = 'Bob';
clystal.getAccessor('user').findFirst(
    'find_by_name',
    {name: name}
)(function(user) {
    // callback
    console.log(user);
})

// find by query
clystal.getAccessor('user/item').find(
    'find_by_user',
    {user_id: userId}
)(function(items) {
    // callback
    console.log(items);
});

// execute query
var itemId = 1;
var num    = 3;
clystal.getAccessor('user/item').execute(
    'insert_or_increase',
    {item_id: itemId, num: num}
)(function(result) {
    // callback
    console.log(result);
});
```

### config.ini.js
```javascript
module.exports = {
    base: '/path/to/format/dir',
    mysql: {
        default : {
            master   : 'localhost',
            slave    : ['localhost'],
            standby  : 'localhost',
            user     : 'root',
            password : 'pass',
            database : 'main'
        },
        main : {},
        sub  : {database: 'sub'},
    },
}
```

### /path/to/format/dir/user.js
```javascript
module.exports = {
    tableName  : 'user',
    primaryKey : 'user_id',
    dsn        : 'sub',
    queries    : {
        insert : 'INSERT INTO __TABLE_NAME__ ( name,   pass,  ctime) VALUES (:name,  :pass,  NOW())',
        find_by_name : 'SELECT * FROM __TABLE_NAME__ WHERE name = :name',
    }
}
```

# Advanced
### Custom Accessor
to extends Accessor, you can make CustomAccessor

- make accessor file on same directory as format
- the file name must be same as format, and append suffix 'Accessor'

ex) ls /path/to/user/format
```
user.js userAccessor.js
```

- export function that extends clystal.accessor
### /path/to/format/dir/userAccessor.js
```javascript
var accessor = require('/path/to/clystal').accessor;
module.exports = (function() {
    // extends accessor
    function UserAccessor() {
        accessor.apply(this, arguments);
    }
    UserAccessor.prototype             = Object.create(accessor.prototype);
    UserAccessor.prototype.constructor = UserAccessor;

    // extend function
    UserAccessor.prototype.getOrCache = function(userId) {
        // check cache at first
        var cache      = getCacheModule();
        var cachedUser = cache.getUser(userId);
        if (cachedUser !== null) {
            return function(callback) {
                callback(cachedUser);
            }
        } else {
            var stmt = this.get(userId);
            return function(callback) {
                stmt(function(user) {
                    cache.saveUser(user);
                    callback(user);
                });
            }
        }
    }

    return UserAccessor;
})();
```

### sample.js
```javascript
// setup clystal
var config  = require('/path/to/config.ini.js');
var clystal = require('/path/to/clystal').init(config);

var userId = 1;
clystal.getAccessor('user').getOrCache(userId)(function(user) {
    console.log(user.name);
});
```
