const testFolder = '/users/mac/Desktop/nodejs.js/web'
const fs = require('fs');

fs.readdir(testFolder, function(err, filelist) {
    console.log(filelist)
})

