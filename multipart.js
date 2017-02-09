/*
 * @module multipart
 * a module for processing multipart HTTP requests.
 */
"use strict;"

// tells node what we want to export.
module.exports = multipart;

const DOUBLE_CLRF = Buffer.from([0x0D,0x0A,0x0D,0x0A]);

/*
 * @function multipart(buffer, boundary, callback) 
 * takes a request and response object,
 * parses the body of the multipart requestand 
 * and attaches its contents to the request 
 * object. if an error occurs, we log its 
 * and send a 50 status code. Otherwise
 * we invoke next() with the request and response.
 */
function multipart(req, res, next){
    var chunks = [];
    req.on('error', function(){
        console.error(err);
        res.statusCode = 500;
        res.end();
    });
    req.on('data', function(chunk){
        chunks.push(chunk);
    });
    req.on('end', function(){
        // TODO: var boundary = req.headers["ContentType"];
        var buffer = Buffer.concat(chunks);
        req.body = processBody(buffer, boundary);
        next(req, res);
    });
}

/*
 * @function processBody(buffer, boundary, callback) 
 * Takes a buffer and a boundary and
 * returns a associative array of 
 * key/value pairs; if content is a 
 * file, value will be an object with 
 * properties filename, contentType,
 * and data.
 */
function processBody(buffer, boundary) {
    var contents = [];
    var start = buffer.indexOf(boundary) + boundary.length + 2; // add two because of carriage return and line feed /r/n.
    var end = buffer.indexOf(boundary, start);
    while(end > start) {
        contents.push(buffer.slice(start, end));
        start = end + boundary.length + 2;
        end = buffer.indexOf(boundary, start);
    }
    
    var parsedCntents = {};
    contents.forEach(function(content){
        parseContent(content, function(err, tuple){
            if(err){ return console.error(err);}
            parsedCntents[tuple[0]] = tuple[1];
        });
    });

    return parsedCntents
}

/*
 * @function parseContent(content, callback) 
 * Parses a content section and returns
 * the key/value pair as a two-element array
 */
function parseContent(content, callback){
    var index = content.indexOf(DOUBLE_CLRF);
    var head = content.slice(0, index).toString();
    var body = content.slice(index + 4);
    var name = /name"([\w\d\-_]+)"/.exec(head);
    var filename = /filename="([\w\d\-_\.]+)"/.exec(head);
    var contentType = /content-Type="([\w\d\/]+)"/.exec(head);

    if(!name){
        return callback("Content without name");
    }
    if(filename){
        // we have a file
        callback(false, [name[1], {
            filename: filename[1],
            contentType: (contentType)? contentType[1]: 'application/octet-stream',
            data: body
        }]);
    } 
    else{
        // we have a value
        callback(false, [name[1], body.toString()]);
    }
}