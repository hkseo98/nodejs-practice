var fs = require('fs');
fs.readFile('data/HTML', 'utf8', function(err, data){
    if (err) throw err;
    console.log(data);
})