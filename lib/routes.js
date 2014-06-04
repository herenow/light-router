//Methods table
var Methods_Table = {
    GET:     {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
    POST:    {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
    HEAD:    {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
    PUT:     {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
    DELETE:  {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
    OPTIONS: {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
    TRACE:   {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
    CONNECT: {
        matching: {}, //indexed by size of paths
        static: {}, //indexed by full path
    },
}

//Exports final table
module.exports = Methods_Table;
