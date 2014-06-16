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
exports.testDynamicRouteSimple = function(test) {
    router.get('/document/when/:date/set/:tomorrow', function(req, res) {
        test.expect(2)
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.equal(req.params.tomorrow, '06102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/document/when/05102014/set/06102014')
}

//Strange dynamic route
exports.testDynamicRouteStranger = function(test) {
    router.get('/document/:name/:date/set/:tomorrow', function(req, res) {
        test.expect(3)
        test.equal(req.params.name, 'something', 'data param did not match')
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.equal(req.params.tomorrow, '06102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/document/something/05102014/set/06102014')
}

//Various dynamic route w/ regexp
exports.testDynamicRouteRegExp = function(test) {
    router.get('/:document/:name/:date(^05102014$)/set', function(req, res) {
        test.expect(3)
        test.equal(req.params.document, 'shala', 'data param did not match')
        test.equal(req.params.name, 'something', 'data param did not match')
        test.equal(req.params.date, '05102014', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/shala/something/05102014/set')
}

//Various dynamic route w/ possible complexitys
exports.testDynamicRouteComplex = function(test) {
    test.expect(3)

    router.get('/api/base/:id', function(req, res) {
        test.equal(req.params.id, '12312', 'data param did not match')
    })
    router.get('/api/:name(^john$)/:id', function(req, res) {
        test.equal(req.params.name, 'john', 'data param did not match')
    })
    router.get('/:api/:name/:id', function(req, res) {
        test.equal(req.params.name, 'lucas', 'data param did not match')
        test.done()
    })

    TestReqTo('GET', '/api/base/12312')
    TestReqTo('GET', '/api/john/12312')
    TestReqTo('GET', '/something/lucas/12312')
}

//Test 404
exports.testNotFound = function(test) {
    router.notFound(function(req, res) {
        test.done()
    })

    TestReqTo('GET', '/this/route/should/not/exist')
}

//Cache on and off
exports.testRouteNoCache = function(test) {
    test.expect(1)

    router.get('/test/cache', function(req, res) {
    }).cache(false)

    TestReqTo('GET', '/test/cache')

    //Check if a cache entry was created
    if(typeof router.baseCache.GET.table['test/cache'] === 'undefined') {
        test.ok(true)
    }
    //Error, the cache was created
    else {
        test.ok(false, 'A cache entry was actually created')
    }

    test.done()
}

//Change cache max size
exports.testSetCacheMaxSize = function(test) {
    test.expect(1)

    router.cacheMaxSize(10)

    test.equal(router.baseCache.GET.max_size, 10, 'Set cache max size didnt seem to work')

    test.done()
}

//Display routing table final
exports.testRoutingTable = function(test) {
    var table = router.routingTable()

    //console.log(JSON.stringify(table, 2, "    "))

    test.done()
}
