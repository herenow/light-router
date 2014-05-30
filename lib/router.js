//Dependencies
var Url = require('url')
var Parser = require('./parser')

//Route table
var Routes = require('./routes')

//Route finder, if nothing is matched nothing is done
//@return void
function Router(req , res) {
    //Retrieve important variables to avoid lookups
    var method = req.method;

    //Select the a routing table based on the request method
    var table  = Routes[method]

    //Parse the url
    var path = Url.parse(req.url).pathname

    //Remove the first and last slash frm the path if present
    path = Parser.trimPathname(path)

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
            req.parameters = {}

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
                        req.parameters[condition.param] = paths[p]
                }

                //We got a handler, run it :) it must be the last part of the path
                if(typeof condition.handler === 'function') {
                    condition.handler(req, res)
                    return
                }
            }
        }
    }

    //No matches were found until now, so try to match with any a static handler
    var static_match = table.static[path]

    if(typeof static_match !== 'undefined') {
        static_match(req, res)
        return
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
