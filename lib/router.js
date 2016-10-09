//Route parser
var Parser = require('./parser')

//Route table
var Routes = require('./routes')

//Return a 404 http code
var notFound = function defaultNotFound(req, res) {
    res.statusCode = 404
    res.end('404 - Not found')
}

//Route finder, if nothing is matched nothing is done
//@return void
function Router(req , res) {
    //Select the a routing table based on the request method
    var table  = Routes[req.method]

    //Parse the url
    var path = Parser.url(req.url)

    //Remove the first and last slash frm the path if present
    path = Parser.trimPathname(path)

    //Try to match one of the static routes first, only then fallback to the dynamic routes
    var static_match = table.staticRoutes[path]

    if(typeof static_match !== 'undefined') {
        var handler = static_match.handler
        
        handler(req, res)
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

    var paramsHolder = []

    var cursor = 0

    var lastTrueTableMatch = table
    var lastTrueCursorMatch = cursor
    var nextParamsMatchIndex = []

    //Start iterating throught the routing tree
    continue_to_next_value:
    while(cursor < size) {
        //Vars
        var value = paths[cursor] //The part of the path we are currently working with

        //First try matching with the hashtable with base paths
        var base = table.bases[value]

        //Check if some base path was matched
        if(typeof base !== 'undefined') {
            cursor++
            table = base
            lastTrueTableMatch = base
            lastTrueCursorMatch = cursor
            lastParamsMatchIndex = 0
            continue //to next match
        }

        //Else, check the parameters table
        var params = table.params
        var paramsIndex = nextParamsMatchIndex[cursor] || 0

        if(params.length > 0) {
            for(; paramsIndex < params.length; paramsIndex++) {
                var key  = params[paramsIndex].param
                var rule = params[paramsIndex].regexp

                if(typeof rule !== 'undefined') {
                    if(rule.test(value) === false) {
                        continue //Try matching next parameter, if exists
                    }
                }

                //If we got here, we found a possible parameter :)
                paramsHolder[cursor] = { key: key, value: value }
                cursor++
                table = params[paramsIndex].routes //recurse into
                continue continue_to_next_value //Break to next part of the paths
            }
        }

        if(lastTrueTableMatch) {
            table = lastTrueTableMatch
            cursor = lastTrueCursorMatch
            nextParamsMatchIndex[cursor] = (nextParamsMatchIndex[cursor] || 0) + 1

            if(! table.params[nextParamsMatchIndex[cursor]]) {
                lastTrueTableMatch = null
                lastTrueCursorMatch = null
            }

            continue continue_to_next_value
        }

        return notFound(req, res)
    }

    // Map found params to req.params holder
    req.params = {}

    for(var i in paramsHolder) {
        var param = paramsHolder[i]

        req.params[param.key] = param.value
    }

    //If we are here, the dynamicRoutes algorithm must have found a route
    //But just in case my algorithm has a logic error, i'll add the default notFound :)
    var routeHandler = table.handler || notFound

    routeHandler(req, res)
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

//Return the routing table
Router.routingTable = function RoutingTable() {
    return Routes
}

//Overide custom 404 not found
Router.notFound = function overideDefaultNotFound(fnc) {
    notFound = fnc
}

//Exports
module.exports = Router
