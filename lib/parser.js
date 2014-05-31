//Dependencies
var url = require('url');
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

    //Discover parameters in the route
    var parameters = pathname2ParamsArray(paths)

    //Static asset, add it to the static table inside the routing table
    if(parameters.length === 0) {
        addStatic2Table(table, pathname, handler)
    }
    //Add this to the matching table
    else {
        var match = add2MatchingTable(table, size, paths, parameters)
        addHandler2MatchingTable(match, handler)
    }
}


//Helper function to check if this base_path exists in an array of routes
function indexOfInRouter(base, router) {
    for(var i in router) {
        if(router[i].base === base) {
            return i
        }
    }
    return -1
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

//Helper function to add a static route to a givens table static routes
//@return void
function addStatic2Table(table, path, handler) {
    table.static[path] = handler
}

//Helper function to add a entry to a determined matching table
//@return object
function add2MatchingTable(table, size, paths, params) {
    var matching_table = table.matching

    //Check if this table was already initialized
    initMatchingTable(matching_table, size)

    //Generate a match entry
    var entry = []

    for(var i = 0; i < size; i++) {
        //Defaults
        var type = 0
        var _static = "", param = ""

        //Index of parameter in parameters array, if exists
        var index = indexOfParam(i, params)

        //No parameter found in the given position, so its a static part of the path
        if(index === -1) {
            type    = 0 //Use the static algorith matching
            _static = paths[i]
        }
        //Its a parameter
        else {
            type    = 1 //Use the parameter algorith matching
            param = params[index].name
        }

        //Push this position to the matching size table
        entry.push({
            type: type,
            static: _static,
            param: param
        })
    }

    //Push the entry to the given size matching_table
    var length = matching_table[size].push(entry)

    return matching_table[size][length - 1]
}

//Helper function to asign a handler to the final condition of a match
//@return void
function addHandler2MatchingTable(match, handler) {
    var last = match.length - 1;

    match[last].handler = handler
}

//Helper function to initialize a matching table given its size
//@return void
function initMatchingTable(matching_table, size) {
    if(typeof matching_table[size] === 'undefined') {
        matching_table[size] = []
    }
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
