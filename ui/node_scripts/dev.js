var fs = require('fs-extra');
 
fs.mkdirs('./src/css'			        , function (err) { if (err)  console.error(err)	} );
fs.mkdirs('./dist/vendor'			, function (err) { if (err)  console.error(err)	} );
fs.mkdirs('./dist/data'			, function (err) { if (err)  console.error(err)	} );

fs.copy('./data/config.json'		        , './dist/data/config.json'			, function (err) { if (err)  console.error(err) });
fs.copy('./src/images'		                , './dist/images'			, function (err) { if (err)  console.error(err) });
fs.copy('./node_modules/core-js/client/shim.min.js'		        , './dist/vendor/shim.min.js'			, function (err) { if (err)  console.error(err) });
fs.copy('./node_modules/core-js/client/shim.min.js.map'		    , './dist/vendor/shim.min.js.map'			, function (err) { if (err)  console.error(err) });
fs.copy('./node_modules/zone.js/dist/zone.min.js'		        , './dist/vendor/zone.min.js'			, function (err) { if (err)  console.error(err) });

