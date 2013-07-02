console.log('test started');

try {
    var clystal = require('../clystal')
        .init('./clystal.ini.json');
    clystal.getAccessor('user').mget(function(user) {
        console.log(user);
    }, [{id:1, name:"john"}, {id:2, name:"takc"}]);
} catch (e) {
    console.log(e);
    console.log('msg : ' + e.msg);
    console.log('ctx : ');
    console.log(e.context);
    throw e
}
