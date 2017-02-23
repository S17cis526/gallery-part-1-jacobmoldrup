/** @module static
 * loads and serves static files
 */

module.exports = {
    loadDir: loadDir,
    isCached:isCached,
    serveFile:serveFile
}
var files = {};
var fs = require('fs');


function loadDir(directory){
    var items = fs.readdir(directory);

    items.forEach(function(item) {
        var path = directory + '/' + item;
        var stats = fs.statSync(path);
        if(stats.isFile())
        {
            var parts = path.split('.');
            var extension = parts[parts.length - 1];
            var type = 'application/octet-stream';
            switch(extension){
                case 'css':
                    type = 'text/css';
                    break;
                case 'js':
                    type = 'text/javascript';
                    break;
                case 'jpeg':
                case 'jpg':
                    type = 'image/jpeg'
                    break;
                case 'png':
                case 'gif':
                case 'bmp':
                case 'tiff':
                    type = 'image/exten' + extension;
                    break;
            }
            files[path] = {
                contentType: type,
                data: fs.readFileSync(path)
            };
        }
        if(stats.isDirectory()){
            loadDir()
        }
    }, this);
}


function isCached(path){
    return files[path] != undefined;
}

function serveFile(path, req, res){
    res.statusCode = 200;
    res.writeHeader(200, {'Content-Type': files[path].contentType});
    res.end(files[path].data);
}