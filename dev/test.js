console.log('test started');

try {
    var clystal = require('../clystal').init('./mysql.ini.json');

} catch (e) {
    console.log(e);
    console.log('msg : ' + e.msg);
    console.log('ctx : ');
    console.log(e.context);
    throw e
}
