//Dependencies
var Cache   = require('base-cache')
var Methods = require('./methods')

//Cache pointers
var Table = {}

//Create caches
for(var i in Methods) {
    Table[ Methods[i] ] = new Cache({
        max_size: 100
    })
}

module.exports = Table
