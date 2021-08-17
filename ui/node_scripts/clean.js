var fs = require('fs-extra');

fs.emptyDir('./dist'			, function (err) { if (err)  console.error(err); });

fs.emptyDir('./src/vendor'			, function (err) { if (err)  console.error(err) });
fs.remove('./src/vendor'			, function (err) { if (err)  console.error(err) });
fs.emptyDir('./src/css'			, function (err) { if (err)  console.error(err) });
fs.remove('./src/css'			, function (err) { if (err)  console.error(err) });
fs.remove('./src/favicon.ico'			, function (err) { if (err)  console.error(err) });