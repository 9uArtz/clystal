console.log('test started');

try {
    var clystal = require('../clystal')
        .init('./clystal.ini.json');
    clystal
        .getAccessor('user')
        .execute('insert', {name: 'jooohn', pass:'aaa'})(function(rows) {
            console.log(rows)
        });
} catch (e) {
    console.log(e);
    console.log('msg : ' + e.msg);
    console.log('ctx : ');
    console.log(e.context);
    throw e
}
