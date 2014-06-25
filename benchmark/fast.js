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

function benchmark_control() {
    fakeRouterControl('GET', '/path/to/parameter/parameter')
}

function benchmark_static() {
    fakeRouter('GET', '/path/to')
}

function benchmark_dynamic() {
    fakeRouter('GET', '/path/to/parameter/parameter')
}

function benchmark_dynamicLast() {
    fakeRouter('GET', '/path/to10/parameter/parameter')
}


var samples = process.argv[2] || 100000
var i = 0
var start = 0, end = 0;

//

start = new Date().getTime();

while(i < samples) {
    benchmark_control();
    i++
}

end = new Date().getTime();

console.log('Control benchmark, %dms', end - start)

//

start = new Date().getTime();

i = 0
while(i < samples) {
    benchmark_static();
    i++
}

end = new Date().getTime();

console.log('Time to route static paths %d samples, %dms', samples, end - start)

//

start = new Date().getTime();

i = 0
while(i < samples) {
    benchmark_dynamic();
    i++
}

end = new Date().getTime();

console.log('Time to route dynamic paths %d samples, %dms', samples, end - start)

//

start = new Date().getTime();

i = 0
while(i < samples) {
    benchmark_dynamicLast();
    i++
}

end = new Date().getTime();

console.log('Time to route dynamic to last paths %d samples, %dms', samples, end - start)
