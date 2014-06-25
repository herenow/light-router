//Methods
var Methods = require('./methods')

//Constructor
function Table() {
    //Build the table
    for(var i in Methods) {
        this[ Methods[i] ] = {
            params: [],
            bases:  {},
        }
    }

    return this
}

//Export it
module.exports = Table
