/**@module router */

module.exports = Router;

var url = require('url');


function Router(){
    this._getRoutes = [];
    this._postRoutes = [];

}

function pathToRegEx(path){
    var tokens = path.split('/');
    var keys = [];
    var parts = tokens.map(function(token){
        if(token.charAt(0) == ":"){
            keys.push(token,slice(1));
            return "(\\w+)";
        } else{
            return token;
        }
    });
    var regexp = new RegExp('^' + parts.join('/') + '/?$');
    return {
        regexp:regexp,
        keys: keys
    }
}


Router.prototype.get() = function(path, handler){
    var route = pathToRegEx(path);
    route.handler = handler;
    this._getRoutes.push(route);
}

Router.prototype.post() = function(path, handler){
    var route = pathToRegEx(path);
    route.handler = handler;
    this._postRoutes.push(route);
}

Router.prototype.route =  function(req, res){
    var urlParts = url.parse(req.url);

    switch(req.method)
    {
        case 'get':
            for(var i = 0; i < this._getRoutes.length; i++){
                var route = this._getRoutes;
                var match = route[i].regexp.exec(urlParts.pathname);
                if(match){
                    req.params = {};
                    for(var j = 1; j <match.length; j++)
                    {
                        req.params[route.keys[j-1]] = match[j];
                    }
                    return this.route.handler(req, res);
                }
            }
            res.statusCode = 404;
            res.statusMessage = "Resource not found";
            res.end();
            break;
        case'post':
            for(var i = 0; i < this._getRoutes.length; i++){
                var route = this._postRoutes;
                var match = route[i].regexp.exec(urlParts.pathname);
                if(match){
                    req.params = {};
                    for(var j = 1; j < match.length; j++)
                    {
                        req.params[route.keys[j-1]] = match[j];
                    }
                    return this.route.handler(req, res);
                }
            }
            res.statusCode = 404;
            res.statusMessage = "Resource not found";
            res.end();
            break;
        default:
            var msg = "Unknown method " + req.method;
            res.statusCode = 400
            res.statusMessage = msg;
            console.error(msg);
            res.end(msg);
    }
}   