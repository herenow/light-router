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

    //Try to make a cache hit here
    var hit = cache.find(req.url)

    if(typeof hit !== 'undefined') {
        hit(req, res)
        return
    }

    //Parse the url
    var path = Parser.url(req.url)

    //Remove the first and last slash frm the path if present
    path = Parser.trimPathname(path)

    //Try to match one of the static routes first, only then fallback to the dynamic routes
    var static_match = table.static[path]

    if(typeof static_match !== 'undefined') {
        cache.add(req.url, static_match)
        static_match(req, res)
        return
    }

    //Explode the path into smallers paths
    var paths = path.split('/')

    //Number of paths in the url
    var size = paths.length

    //Matching/parameter router based on the size
    var matching = table.matching[size]

    //Check if there are any dynamic routes this size, if not, dont even bother
    if(typeof matching !== 'undefined') {
        //Itenerate throught the matches of the current table we are in based in the size of paths
        for(var m in matching) {
            var match = matching[m]

            //Clear the request parameters holder
            req.params = {}

            //Loop through all parts of this match
            current_match:
            for(var p in match) {
                var condition = match[p]

                //How to match this part of the path
                switch(condition.type) {
                    //Must equal to this
                    case 0:
                        //Check if doesnt match this condition
                        if(condition.static !== paths[p]) {
                            break current_match
                        }
                        break;
                    //Can equal anything, just save its value
                    case 1:
                        //This isnt really a condition, anything will match here :)
                        req.params[condition.param] = paths[p]
                }

                //We got a handler, run it :) it must be the last part of the path
                if(typeof condition.handler === 'function') {
                    cache.add(req.url, condition.handler)
                    condition.handler(req, res)
                    return
                }
            }
        }
    }
}


//Router methods
Router.get    = Parser.bind({method: "GET"})
Router.post   = Parser.bind({method: "POST"})
Router.put    = Parser.bind({method: "PUT"})
Router.head   = Parser.bind({method: "HEAD"})
Router.delete = Parser.bind({method: "DELETE"})

//Expose routing table
Router.routingTable = function RoutingTable() {
    return Routes
}

//Exports
module.exports = Router
