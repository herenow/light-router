/**
 * General testing of the router (BDD)
 */
var router = require('../index.js')
var http   = require('http')


/**
 * Simulate an http server
 */
function TestReqTo(method, path) {
    router({
        method: method,
        url: path
    }, {});
}


//Test test :)
exports.testTest = function(test) {
    test.ok(true)
    test.done()
}

//Get /document
exports.testStaticGetRoute = function(test) {
    router.get('/document', function(req, res) {
        test.done()
    })

    TestReqTo('GET', '/home')
}

//Post /document
exports.testStaticPostRoute = function(test) {
    router.post('/document', function(req, res) {
        test.done()
    })

    TestReqTo('POST', '/document')
}

//Head /document
exports.testStaticPostRoute = function(test) {
    router.head('/document', function(req, res) {
        test.done()
    })

    TestReqTo('HEAD', '/document')
}

//Put /document
exports.testStaticPostRoute = function(test) {
    router.put('/document', function(req, res) {
        test.done()
    })

    TestReqTo('PUT', '/document')
}

//Delete /document
exports.testStaticPostRoute = function(test) {
    router.delete('/document', function(req, res) {
        test.done()
    })

    TestReqTo('DELETE', '/document')
}
