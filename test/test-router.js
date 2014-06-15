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

    TestReqTo('GET', '/document')
}

//Post /document
exports.testStaticPostRoute = function(test) {
    router.post('/document', function(req, res) {
        test.done()
    })

    TestReqTo('POST', '/document')
}

//Head /document
exports.testStaticHeadRoute = function(test) {
    router.head('/document', function(req, res) {
        test.done()
    })

    TestReqTo('HEAD', '/document')
}

//Put /document
exports.testStaticPutRoute = function(test) {
    router.put('/document', function(req, res) {
        test.done()
    })

    TestReqTo('PUT', '/document')
}

//Delete /document
exports.testStaticDeleteRoute = function(test) {
    router.delete('/document', function(req, res) {
        test.done()
    })

    TestReqTo('DELETE', '/document')
}

//Dynamic routes
exports.testDynamicRoute = function(test) {
    router.get('/document/when/:date/set/:tomorrow', function(req, res) {
        test.expect(2)
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.equal(req.params.tomorrow, '06102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/document/when/05102014/set/06102014')
}

//Strange dynamic route
exports.testDynamicRoute2 = function(test) {
    router.get('/document/:name/:date/set/:tomorrow', function(req, res) {
        test.expect(3)
        test.equal(req.params.name, 'something', 'data param did not match')
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.equal(req.params.tomorrow, '06102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/document/something/05102014/set/06102014')
}

//Various dynamic route
exports.testDynamicRoute3 = function(test) {
    router.get('/:document/:name/:date/set', function(req, res) {
        test.expect(3)
        test.equal(req.params.document, 'shala', 'data param did not match')
        test.equal(req.params.name, 'something', 'data param did not match')
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/shala/something/05102014/set')
}

//Display routing table final
exports.testRoutingTable = function(test) {
    var table = router.routingTable()

    console.log(JSON.stringify(table, 2, "    "))

    test.done()
}
