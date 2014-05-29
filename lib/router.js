//Dependencies
var Url = require('url')
var Parser = require('./parser')
var BasePaths   = require('./base')
var StaticMatch = require('./static')

//Routes list
var Routes = require('./routes')

//Sort table
var Index_sort_table = []

//Analysis variables
var total_routes = 0;
var total_hits = 0;

//Route finder
function Router(req , res) {
    //Retrieve important variables to avoid lookups
    var method = req.method;

    //Narrow down possible routes by method
    var routes = Routes[method];

    //Parse the url
    var path = url.parse(req.url)

    //First match static paths
    var route = StaticMatch(path.pathname)

    //If not exists send to 404 handler
    if(! route) {
        return NotFound(req, res)
    }

    //Send to proper handler
    route.handler(req, res)
}

//Route adder
function RouteAdd(path, handler) {
    var method = this.method;

    //Discover its type
    var type = TypeOfPath(path);

    //Start adding the route to the system
    var id = total_routes++;

    //Add the route
    Routes.push({
        id: id,
        type: type,
        method: method,
        handler: handler,
    })

    //Add it to the sort table, bottom of the table
    Index_sort_table.push({
        route_id: id,
    })

    return new Route(id);
}

//Swap positions between elements in the sort table
function SortTableSwap(a, b) {
    var holder = Index_sort_table[a];

    Index_sort_table[a] = Index_sort_table[b];
    Index_sort_table[b] = holder;
}

//Router bae method
Router.base   = Base;

//Router methods
Router.get    = RouteAdd.bind({method: "GET"})
Router.post   = RouteAdd.bind({method: "POST"})
Router.put    = RouteAdd.bind({method: "PUT"})
Router.head   = RouteAdd.bind({method: "HEAD"})
Router.delete = RouteAdd.bind({method: "DELETE"})

//Routes methods
Route.static =
Route.match  =
Route.regexp =

//Exports
module.exports = Router
