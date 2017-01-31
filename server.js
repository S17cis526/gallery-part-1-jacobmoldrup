"use strict"; // this tells node interpreter to be in strict mode. Strict mode enforces all rules exactly.

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 var http = require('http'); //this says load the http library up and binds it to the variable.
 var fs = require('fs');// library that allows us to get into the file system.
 var port = 9595; 

 // var  chess = fs.readFileSync('image/chess.jpg'); // loads file into memory. vould do this if we have a small num of files.
 // var  fern = fs.readFileSync('image/fern.jpg'); // loads file into memory
 // var  bubble = fs.readFileSync('image/bubble.jpg'); // loads file into memory
 // var  ace = fs.readFileSync('image/ace.jpg'); // loads file into memory
 // var  mobile = fs.readFileSync('image/mobile.jpg'); // loads file into memory
var stylesheet = fs.readFileSync('gallery.css');
var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

function serveImage(filename, req, res) {
    fs.readFile('images/' + filename, function(err, body){ // file path relative to our location. Body now contains the binary data that is this pic.
        if(err) {
            console.error(err);
            res.statusCode = 500;
            res.statusMessage = "Server Error";
            res.end("Silly me");
            return;
        }
        res.setHeader("Content-Type", "image/jpeg");// says content type is a jpeg. This must be done before res.end() is called.
        res.end(body); // says we are done with the response and to send it. This would send the chess image.
    });
}

 var server  = http.createServer(function(req, res) {
    
    switch(req.url) {
            case "/gallery":
            case "/Gallery":
            var gHtml = imageNames.map( function(filename){
                return '<img src="' + filename +'" alt="a fishing ace at work">';
            }).join('');
            var html = '<!doctype html>';
                html += '<head>'
                html +=   '<title>Gallery</title>';
                html +=   '<link href="gallery.css" rel="stylesheet" type="text/css"></link>';
                html += '</head>';
                html += '<body>';
                html += '   <h1>Gallery</h1>';
                html += gHtml;
                html += '   <img src="/ace.jpg" alt="a fishing ace at work">';
                html += '   <h1>Hello.</h1> Time is ' + Date.now();
                html += '</body>';
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            break;
            case "/chess":
            case "/chess/":
            case "/chess.jpeg":
            case "/chess.jpg":
                // res.end(chess); if we wanted to use the files loaded in memory.
                serveImage('chess.jpg', req, res);
                break;
            case "/fern":
            case "/fern/":
            case "/fern.jpeg":
            case "/fern.jpg":
                // res.end(fern); if we wanted to use the files loaded in memory.
                serveImage('fern.jpg', req, res);
                break;
            case "/ace":
            case "/ace/":
            case "/ace.jpeg":
            case "/ace.jpg":
                // res.end(ace); if we wanted to use the files loaded in memory.
                serveImage('ace.jpg', req, res);
                break;
            case "/bubble":
            case "/bubble/":
            case "/bubble.jpeg":
            case "/bubble.jpg":
                // res.end(bubble); if we wanted to use the files loaded in memory.
                serveImage('bubble.jpg', req, res);
                break;
            case "/mobile":
            case "/mobile/":
            case "/mobile.jpeg":
            case "/mobile.jpg":
                // res.end(mobile); if we wanted to use the files loaded in memory.
                serveImage('mobile.jpg', req, res);
                break;
            case "/gallery.css":
            case "/gallery.css/":
                res.setHeader('Content-Type', 'text/css');
                res.end(stylesheet);
                break;
            default: 
                res.statusCode = 404;
                res.statusMessage = "Not Found";
                res.end();
    }
 }); // this creates a server to listen and respond to http request. The one arg is a function we want it to call to handle requests. here we used a lambda.

 server.listen(port, function(){
     console.log("Listening on Port " + port);
 });// says to listen on port 9595. and sends a message.
