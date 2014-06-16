//Dependencies
var Parser = require('./parser')

//Route table
var Routes = require('./routes')

//Cache table
var Cache  = require('./caches')

//Route finder, if nothing is matched nothing is done
//@return void
function Router(req , res) {
    //Select the a routing table based on the request method
    var table  = Routes[req.method]

    //Select cache table
    var cache = Cache[req.method]

    //Parse the url
    var path = Parser.url(req.url)

    //Remove the first and last slash frm the path if present
    path = Parser.trimPathname(path)

    //Try to make a cache hit here
    var hit = cache.find(path)

    if(typeof hit !== 'undefined') {
        req.params = hit.params || {}
        hit.handler(req, res)
        return
    }

    //Try to match one of the static routes first, only then fallback to the dynamic routes
    var static_match = table.staticRoutes[path]

    if(typeof static_match !== 'undefined') {
        cache.add(path, {handler: static_match})
        static_match(req, res)
        return
    }

    //Explode the path into smallers paths
    var paths = path.split('/')

    //Number of paths in the url
    var size = paths.length

    //Recurse into dynamicRoutes table
    table = table.dynamicRoutes[size]

    //Check if there are any dynamic routes this size, if not, dont even bother
    if(typeof table === 'undefined') {
        return notFound(req, res)
    }

    //Clear the request parameters holder
    req.params = {}

    //Start iterating throught the routing tree
    continue_to_next_value:
    for(var i = 0; i < size; i++) {
        //Vars
        var value = paths[i] //The part of the path we are currently working with

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

        //If we got here, nothing was found, return 404
        //Add to cache, this 404, to save cpu in future requests.
        //We dont need to cache other 404 cause they dont take so much cpu as this one did
        cache.add(path, {handler: notFound})

        return notFound(req, res)
    }

    //If we are here, the dynamicRoutes algorithm must have found a route
    var handler = table.handler || notFound

    cache.add(path, {handler: handler, params: req.params})
    handler(req, res)
}

//Return a 404 http code
function notFound(req, res) {
    res.statusCode = 404
    res.end('404 - Not found')
}


//Router methods
Router.get     = Parser.bind({method: "GET"})
Router.post    = Parser.bind({method: "POST"})
Router.put     = Parser.bind({method: "PUT"})
Router.head    = Parser.bind({method: "HEAD"})
Router.delete  = Parser.bind({method: "DELETE"})
Router.options = Parser.bind({method: "OPTIONS"})
Router.trace   = Parser.bind({method: "TRACE"})
Router.connect = Parser.bind({method: "CONNECT"})

//Expose routing table
Router.routingTable = function RoutingTable() {
    return Routes
}

//Expose the base-cache
Router.baseCache = Cache

//Exports
module.exports = Router
