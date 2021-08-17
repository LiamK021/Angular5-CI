Last Update: October 22, 2018


API project:
------------
This is a CodeIgniter 3 project (needs apache and MySQL to run). to configure, you need to go to two places to make changes:

1- application/config/config.php: edit the base_url variable to match the new server url (example, if your server's URL is http://envision.morscad.com then your base_url should be http://envision.morscad.com/api. 

2- application/config/database.php edit the database info database name (if different from what we initially coded), mysql username and password and database host to match the server access info
this needs to be deployed in a folder on the server root called "api"

Important: Make sure that the csv folder and the images folder on the server have the right permissions for the application to be able to upload to them (recommended permissions: 755)


UI project: 
-----------
this is an Angular5 project that runs with NPM. To run, from the command line type `npm install` to install package dependencies, then run `npm run dev` which will generate the files and copy them to the `dist` folder.
the files in the "dist" folder are what need to be deployed on the server root. 
Before deployment, the config file in dist/data/config.json needs to be edited to match the path to the API path

Example: if we deploy the files on http://envision.morscad.com, the config file will look like this:
{
    "apiPath" : "http://envision.morscad.com"
}
The code will automatically append this to each request. 
example: [ config.apiPath+"/api/index.php/cms/"+{{function_name}} ] 

Make sure that your config api path does not end with a trailing slash.

when deployed, the server root should look like this:


/
index.html
inline.bundle.js
inline.bundle.js.map
main.bundle.js
main.bundle.js.map
styles.bundle.js
styles.bundle.js.map
vendor.bundle.js
vendor.bundle.js.map
vendor/
images/
data/
api/
    application/
    system/
    user_guide/
    vendor/
    csv/
    images/
    ...



Fix 404 issue:
------------

On Ubuntu 16.04, go to /etc/apache2/, open apache2.conf, find `<Directory /var/www/>` and replace AllowOverride None to AllowOverride All
Then go to /var/www/html or whatever subdirectory your UI project is located and put .htaccess file here with following content:

FallbackResource /index.html
DirectoryIndex index.html

New build scripts:
------------

Use npm run build:media to build the app with media page
Use npm run build:takeover to build the app with takeover page

Once you made changes to validation config, you can copy the config directly to data/config.json on deployment path or you can rebuild and copy everything.

Media uploads:
------------

For media uploads to work properly you have to create media directory in /api
and set permissions to 777: chmod 777 ./api/media