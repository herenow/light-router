var Benchmark = require('benchmark');

var tests = require('../test/test-router.js')
var router = require('../index')

router.get('/path/to', function() { })
router.get('/path/to/:dyn/:router', function() { })
router.get('/path/to1/:dyn/:router', function() { })
router.get('/path/to2/:dyn/:router', function() { })
router.get('/path/to3/:dyn/:router', function() { })
router.get('/path/to4/:dyn/:router', function() { })
router.get('/path/to5/:dyn/:router', function() { })
router.get('/path/to6/:dyn/:router', function() { })
router.get('/path/to7/:dyn/:router', function() { })
router.get('/path/to8/:dyn/:router', function() { })
router.get('/path/to9/:dyn/:router', function() { })
router.get('/path/to10/:dyn/:router', function() { })

function fakeRouterControl(method, path) {
    (function controlRouter(req, res) {
        return
    })(method, path);
}

function fakeRouter(method, path) {
    router({
        method: method,
        url: path
    }, {})
}

var suite = new Benchmark.Suite;

// add tests
suite.add('Control', function() {
    fakeRouterControl('GET', '/path/to/parameter/parameter')
})
.add('Routing to static routes', function() {
    fakeRouter('GET', '/path/to')
})
.add('Routing to first dynamic route', function() {
    fakeRouter('GET', '/path/to/parameter/parameter')
})
.add('Routing to last dynamic route', function() {
    fakeRouter('GET', '/path/to10/parameter/parameter')
})
// add listeners
.on('cycle', function(event) {
    console.log("%s", String(event.target));
})
// run async
.run({ 'async': false });
