console.log('test started');

try {
    var clystal = require('../clystal');
    clystal.init('./clystal.ini.json');
    clystal
        .getAccessor('user')
        .get(1)(function(rows) {
            console.log(rows)
        });
} catch (e) {
    console.log(e);
    console.log('msg : ' + e.msg);
    console.log('ctx : ');
    console.log(e.context);
    throw e
}
