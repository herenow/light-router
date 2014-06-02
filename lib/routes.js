//Routing table struct
var Routing_Table = {
    matching: {}, //indexed by size of paths
    static: {}, //indexed by full path
}

//Methods table
var Methods_Table = {
    GET:     Routing_Table,
    POST:    Routing_Table,
    HEAD:    Routing_Table,
    PUT:     Routing_Table,
    DELETE:  Routing_Table,
    OPTIONS: Routing_Table,
    TRACE:   Routing_Table,
    CONNECT: Routing_Table,
}

//Exports final table
module.exports = Methods_Table;
