/**
 * General testing of the router (BDD)
 */
var router = require('../index.js')
var http   = require('http')


/**
 * Simulate an http server
 */
function TestReqTo(method, path) {
    router.process({
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
exports.testDynamicRouteSimple = function(test) {
    test.expect(2)

    router.get('/document/when/:date/set/:tomorrow', function(req, res) {
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.equal(req.params.tomorrow, '06102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/document/when/05102014/set/06102014')
}

//Strange dynamic route
exports.testDynamicRouteStranger = function(test) {
    test.expect(3)

    router.get('/document/:name/:date/set/:tomorrow', function(req, res) {
        test.equal(req.params.name, 'something', 'data param did not match')
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.equal(req.params.tomorrow, '06102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/document/something/05102014/set/06102014')
}

//Various dynamic route w/ regexp
exports.testDynamicRouteRegExp = function(test) {
    test.expect(3)

    router.get('/:document/:name/:date(^05102014$)/set', function(req, res) {
        test.equal(req.params.document, 'shala', 'data param did not match')
        test.equal(req.params.name, 'something', 'data param did not match')
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/shala/something/05102014/set')
}

//Various dynamic route w/ possible complexitys
exports.testDynamicRouteComplexRegexp = function(test) {
    test.expect(2)

    router.get('/api/base/:id', function(req, res) {
        test.equal(req.params.id, '12312', 'data param did not match')
    })
    router.get('/api/:name(^john$)/:id', function(req, res) {
        test.equal(req.params.name, 'john', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/api/base/12312')
    TestReqTo('GET', '/api/john/12312')
}

//Wild card route
exports.testWildCardRoutes = function(test) {
    test.expect(3)

    router.get('/auth/do', function(req, res) {
        test.ok(true)
    })

    router.get('/auth/doagain', function(req, res) {
        test.ok(true)
    })

    var get = router.get('/auth/*', function(req, res) {
        test.ok(true)
        test.done()
    })

    TestReqTo('GET', '/auth/do')
    TestReqTo('GET', '/auth/doagain')
    TestReqTo('GET', '/auth/something/with/this')
}

//Base path
exports.testBaseRoute = function(test) {
    test.expect(1)

    var base = router.base('/account')

    base.get('/login', function(req, res) {
        test.ok(1)
        test.done()
    })

    TestReqTo('GET', '/account/login')
}

//Test 404
exports.testNotFound = function(test) {
    router.notFound(function(req, res) {
        test.done()
    })

    TestReqTo('GET', '/this/route/should/not/exist')
}

//Display routing table final
exports.testRoutingTable = function(test) {
    var table = router.routingTable()

    console.log(JSON.stringify(table, 2, "    "))

    test.done()
}
