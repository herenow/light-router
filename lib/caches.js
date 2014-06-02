//Dependencies
var Cache  = require('base-cache')
var Routes = require('./routes')

//Cache pointers
var Table = {}

//Create caches
for(var method in Routes) {
    Table[method] = new Cache()
}

module.exports = Table
