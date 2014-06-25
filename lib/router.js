//Route parser
var Parser = require('./parser')

//Route table
var Routes = require('./routes')

//Cache table
var Cache  = require('./caches')

//Return a 404 http code
var notFound = function defaultNotFound(req, res) {
    res.statusCode = 404
    res.end('404 - Not found')
}

//Route finder, if nothing is matched nothing is done
//@return void
function Router() {
    //Routing table
    this.Table = new Routes()

    return this
}

//Request router
Router.prototype.process = function requestRouter(req, res) {
    //Select the a routing table based on the request method
    var table  = this.Table[req.method]

    //Select cache table based on request method
    //var cache  = Cache[req.method]

    //Parse the url
    var path = Parser.url(req.url)

    //Remove the first and last slash frm the path if present
    path = Parser.trimPathname(path)

    //Cache hit
    /*
    var hit = cache[path]

    if(typeof hit !== 'undefined') {
        console.log('cache hit')
        req.params = hit.params
        hit.handler(req, res)
        return
    }
    */

    //Explode the path into smallers paths
    var paths = path.split('/')

    //Number of paths in the url
    var size = paths.length

    //Clear the request parameters holder
    req.params = {}

    //Start iterating throught the routing tree
    continue_to_next_value:
    for(var i = 0; i < size; i++) {
        //The part of the path we are currently working with
        var value = paths[i]

        //First try matching with the hashtable with base paths
        var base = table.bases[value]

        //Check if some base path was matched
        if(typeof base !== 'undefined') {
            table = base //recurse into
            continue //to next match
        }
        //Else, check the parameters table
        else if(table.params.length > 0) {
            var params = table.params

            for(var p in params) {
                var key  = params[p].param
                var rule = params[p].regexp

                if(typeof rule !== 'undefined') {
                    if(rule.test(value) === false) {
                        continue //Try matching next parameter, if exists
                    }
                }

                //If we got here, we found a possible parameter :)
                req.params[key] = value
                table = params[p].routes //recurse into
                continue continue_to_next_value //Break to next part of the paths
            }
        }

        //Try wildcard, this will fallback to the default handler
        if(table.wildcard === true) {
            break continue_to_next_value
        }

        //If we got here, nothing was found, return 404
        //Add to cache, this 404, to save cpu in future requests.
        //We dont need to cache other 404 cause they dont take so much cpu as this one did
        //cache.add(path, {handler: notFound})

        return notFound(req, res)
    }

    //If we are here, the dynamicRoutes algorithm must have found a route
    //But just in case my algorithm has a logic error, i'll add the default notFound :)
    var routeHandler = table.handler || notFound
    /*
    var shouldCache  = table.cache

    if(shouldCache === true) {
        cache.add(path, {handler: routeHandler, params: req.params})
    }
    */
    routeHandler(req, res)
}

//Http methods
Router.prototype.get = function(route, handler) {
    return Parser(route, handler, this.Table.GET)
}
Router.prototype.post = function(route, handler) {
    return Parser(route, handler, this.Table.POST)
}
Router.prototype.put = function(route, handler) {
    return Parser(route, handler, this.Table.PUT)
}
Router.prototype.head = function(route, handler) {
    return Parser(route, handler, this.Table.HEAD)
}
Router.prototype.delete = function(route, handler) {
    return Parser(route, handler, this.Table.DELETE)
}
Router.prototype.options = function(route, handler) {
    return Parser(route, handler, this.Table.OPTIONS)
}
Router.prototype.trace = function(route, handler) {
    return Parser(route, handler, this.Table.TRACE)
}
Router.prototype.connect = function(route, handler) {
    return Parser(route, handler, this.Table.CONNECT)
}

//Add base route
Router.prototype.base = function allRoutes(path, handler) {
    var Methods = {}

    //Append wildcard
    path = Parser.trimPathname(path)
    path += '/*'

    //Handler
    if(typeof handler === 'undefined') {
        handler = this.notFound
    }

    //Self
    var self = this

    //Recreate methods
    Object.keys(this.Table).forEach(function(method) {
        method = method.toLowerCase()
        Methods[method] = self[method](path, handler).append
    })

    //Return each route created
    return Methods
}

//Return the routing table
Router.prototype.routingTable = function RoutingTable() {
    return this.Table
}

//Overide custom 404 not found
Router.prototype.notFound = function overideDefaultNotFound(fnc) {
    notFound = fnc
}

//Exports
module.exports = Router
