var fs = require('fs-extra');

if(process.argv[2] === 'media'){
    fs.copy('./data/appConfig.media.json', './dist/data/appConfig.json', function (err) { if (err)  console.error(err) });
}

if(process.argv[2] === 'takeover'){
    fs.copy('./data/appConfig.takeover.json', './dist/data/appConfig.json', function (err) { if (err)  console.error(err) });
}