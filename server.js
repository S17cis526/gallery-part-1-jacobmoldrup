"use strict"; // this tells node interpreter to be in strict mode. Strict mode enforces all rules exactly.

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 var http = require('http'); //this says load the http library up and binds it to the variable.
 var fs = require('fs');// library that allows us to get into the file system.
 var port = 9595; 
 
 var config =  JSON.parse(fs.readFileSync('config.json'));

 var url = require('url');

 // var  chess = fs.readFileSync('image/chess.jpg'); // loads file into memory. vould do this if we have a small num of files.
 // var  fern = fs.readFileSync('image/fern.jpg'); // loads file into memory
 // var  bubble = fs.readFileSync('image/bubble.jpg'); // loads file into memory
 // var  ace = fs.readFileSync('image/ace.jpg'); // loads file into memory
 // var  mobile = fs.readFileSync('image/mobile.jpg'); // loads file into memory
var stylesheet = fs.readFileSync('gallery.css');
var stylesheet = fs.readFileSync('gallery.css');
var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

// dynamically gets all the file names in images folders.
function getImageNames(callback) {
    fs.readdir('images/', function(err, fileNames) {
        if(err){ callback(err, undefined); }
        else{ callback(false, fileNames)};
        
    });
}

// mapes file names to img tags.
function imageNamesToTags(fileNames) {
    return fileNames.map(function (fileName){
        return `<img src="${fileName}" alt="${fileName}">`;
    });

}


function serveImage(filename, req, res) {
    fs.readFile('images/' + filename, function(err, body){ // file path relative to our location. Body now contains the binary data that is this pic.
        if(err) {
            console.error(err);
            res.statusCode = 404;
            res.statusMessage = "Resource not found";
            res.end("Silly me");
            return;
        }
        res.setHeader("Content-Type", "image/jpeg");// says content type is a jpeg. This must be done before res.end() is called.
        res.end(body); // says we are done with the response and to send it. This would send the chess image.
    });
}


function uploadImage(req, res){
    var body = '';
    req.on('error',function(){
        res.statusCode = 500;
        res.end();
    });
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        fs.writeFile('filename', data, function(err){
            if(err) {
                console.error(err);
                res.statusCode = 500;
                res.end();
                return;
            }
            serveGallery(req, res);
        });
    });
}

function serveGallery(req, res){
    getImageNames(function(err, imageNames){
        if(err){ 
            console.error(err);
            res.statusCode = 500;
            res.statusMessage = "Server Error";
            res.end("Whoops");
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(buildGallery(imageNames));
    });
}

function buildGallery(imageTags)
{
    var html = '<!doctype html>';
        html += '<head>';
        html +=   '<title>' + config.title + '</title>';
        html +=   '<link href="gallery.css" rel="stylesheet" type="text/css"></link>';
        html += '</head>';
        html += '<body>';
        html += '   <h1>' + config.title + '</h1>';
        html += '<form action="">';
        html += '    <input type="text" name="title">';
        html += '    <input type="submit" value="Change Gallery Title">';
        html += '</form>';
        html += imageNamesToTags(imageTags).join('');
        html += '<form action="" method="POST" enctype="multipart/form-data">';
        html += '    <input type="file" name="image">';
        html += '    <input type="submit" value="Upload Image">';
        html += '</form>';
        html += '   <h1>Hello.</h1> Time is ' + Date.now();
        html += '</body>';
    return html

}

 var server  = http.createServer(function(req, res) {
    // at most, the url should hvae two parts -
    // a resource and a querystring separated by a ?
    var urlParts = url.parse(req.url);
        
    // testregular expressions at www.scriptular.com
    if(urlParts.query) {
        var matches = /title=(.+)(&|$)/.exec(urlParts.query);
        
        // captured matching text starts at index 1.
        if(matches && matches[1]){
            config.title = decodeURIComponent(matches[1]);
            fs.writeFile('config.json',JSON.stringify(config));
        }
    }

    switch(urlParts.pathname) {
        case '/':
        case "/gallery":
        case "/Gallery":
            if(req.method == 'GET'){
                
                serveGallery(req, res);
            } else if(req.method = 'POST'){
                uploadImage(req, res);
            }
        break;
        case "/gallery.css":
        case "/gallery.css/":
            res.setHeader('Content-Type', 'text/css');
            res.end(stylesheet);
            break;
        default: 
            serveImage(req.url, req, res);
    }
 }); // this creates a server to listen and respond to http request. The one arg is a function we want it to call to handle requests. here we used a lambda.

 server.listen(port, function(){
     console.log("Listening on Port " + port);
 });// says to listen on port 9595. and sends a message.
