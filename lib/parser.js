//Dependencies
var Routes = require('./routes')

//Parse a route and put it into the routing table
function Parser(pathname, handler) {
    //Narrow it down with the method table
    var method = this.method
    var table = Routes[method]

    //Check if returning function was passed
    if(typeof handler !== 'function') {
        throw 'No handler function was passed'
    }

    //Remove the first and last slash frm the expression if present
    pathname = trimPathname(pathname)

    //Split the path into paths to start indexing
    var paths = pathname.split('/')

    //Size, this will be used as an index later on
    var size = paths.length

    //Check if its a static route
    var params = pathname2ParamsArray(paths)

    //Its static, add to static routes and finish
    if(params.length === 0) {
        table.staticRoutes[pathname] = handler
        return
    }

    //Its a dynamic route, recurse into dynamicRoutes
    table = table.dynamicRoutes

    //Check if a routing table for the given size filter already exists, if not create
    if(typeof table[size] === 'undefined') {
        table[size] = {
            params: [],
            bases:  {},
        }
    }

    //Recurse into table filtered by size
    table = table[size]

    //Add route to dynamic table table
    for(var i = 0; i < size; i++) {
        var path = paths[i]
        var param_index = indexOfParam(i, params)

        //Its an parameter
        if(param_index > -1) {
            var param = params[ param_index ]

            var length = table.params.push({
                param: param.name,
                rule: null,
            })

            //Recurse into table created
            table = table.params[ length - 1 ]

            //Add routing scheme
            table.routes = {
                params: [],
                bases:  {}
            }

            //Check if this is the last iteration, if so, add the handler
            if(i >= size - 1) {
                table.routes.handler = handler
            }

            //Recurse into
            table = table.routes
        }
        //Its a base path
        else {
            //Create a new table
            table.bases[path] = {}

            //Recurse into newly created routing table
            table = table.bases[path]

            //Add routing scheme
            table.params = []
            table.bases  = {}

            //Check if this is the last iteration, if so, add the handler
            if(i >= size - 1) {
                table.handler = handler
            }
        }
    }
}


//Helper function to trim the pathnames first and last slash
//@return string (trimed pathname)
function trimPathname(pathname) {
    if(pathname.charAt(0) === '/') {
        pathname = pathname.substring(1)
    }

    if(pathname.charAt(pathname.length - 1) === '/') {
        pathname = pathname.substring(pathname.length)
    }

    return pathname
}

//Helper function to construct an array with parameters of a pathname
//@return [] (parameters found)
function pathname2ParamsArray(paths) {
    var params = []

    for(var p in paths) {
        var path = paths[p]

        if(path.charAt(0) === ':') {
            params.push({
                pos: parseInt(p),
                name: path.substring(1)
            })
        }
    }

    return params;
}

//Helper function to retrieve parameters inside an given array of paths
//@return integer (index in the array)
function indexOfParam(pos, parameters) {
    for(var i in parameters) {
        if(parameters[i].pos == pos) {
            return i
        }
    }
    return -1
}

//Helper function to properly parse a url, this replaces require('url').parse(path).pathname
function urlParse(url) {
    var query = url.indexOf('?')

    if(query !== -1) {
        url = url.substring(0, query)
    }

    return url
}


//Exports
Parser.trimPathname = trimPathname
Parser.url = urlParse
module.exports = Parser
