console.log('test started');

try {
    var clystal = require('../clystal')
        .init('./clystal.ini.json');
    var accessor = clystal.getAccessor('user');
    accessor.get(function(err, rows, fields) {
        console.log({err:err, rows:rows, fields:fields});
    }, 1);
} catch (e) {
    console.log(e);
    console.log('msg : ' + e.msg);
    console.log('ctx : ');
    console.log(e.context);
    throw e
}
