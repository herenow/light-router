light-router
============
[![Build Status](https://travis-ci.org/herenow/light-router.svg?branch=master)](https://travis-ci.org/herenow/light-router)

A router for node.js performance junkies :)

Note that this router is not as flexible as other routers, it is mostly useful for building simple APIs that don't depend on complex middleware schemes.


Why?
---------
Most node.js http routers I tested had a really high overhead for a router, and in some cases it became the bottleneck of really simple API's I wrote. [See benchmarks below](#benchmarks)


Install
---------
```
npm install light-router
```

Sample usage
---------
```javascript
var http   = require('http')
var router = require('light-router')

//Start an http server and pass all requests to light-router
http.createServer(router).listen(80)

//Set a route and its handler fnc
router.get('/v1/hello/:user', function(req, res) {
  res.end('Hello, ' + req.params.user)
})
```

* Note that this module has a singleton design pattern.
* The only thing that this router does to the `req` object is attach params.


Features
----------
* **Hashtable based** routing
* **RegExp** for parameter testing
* **404**, set custom not found handler


Methods overview
------------
I recommend reading everything if you want to get a general overview of the architecture of this router.

####router[method]\(route, handler)
The following http methods are avaialble: **get, post, put, head, delete, options, trace, connect**
Writing routes follows the express/rails model. You can write **:param** to extract params from the request url and **:param(regexp)** to create rules for the parameter. **Be careful with the order you declare your routes!**

```javascript
//Will only match integer userIDs
router.get('/v1/user/:id([0-9])', function(req, res) {
  res.end('Your numeric userID is: ' + req.params.id)
})

//Will only match all other ids that werent numerical only
router.get('/v1/user/:id)', function(req, res) {
  res.end('Your userID is: ' + req.params.id)
})
```


<a name="benchmarks"></a>Benchmarks
---------

**Controll benchmark**
```javascript
require('http').createServer(function(req, res) {
  res.end('benchmark')
}).listen(2048)
```
```
$ wrk http://127.0.0.1:2048/
Running 10s test @ http://127.0.0.1:2048/
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   819.22us  229.24us   5.89ms   75.51%
    Req/Sec     6.41k     1.00k   10.11k    73.97%
  121048 requests in 10.00s, 14.66MB read
Requests/sec:  12108.13
Transfer/sec:      1.47MB
```

**Light-router server**
```javascript
var router = require('light-router')

require('http').createServer(router).listen(2048)

function respond(req, res) {
  res.end('benchmark')
}

router.get('/v1', respond)
router.get('/v1/hello', respond)
router.get('/v1/user/:id', respond)
router.get('/v1/user/status/:id', respond)
router.get('/v1/register/status/:id([0-9])', respond)
router.get('/v1/emails/:provider', respond)
router.get('/v1/time/:gmt(^\\+[0-9]{1,2}$)', respond)
```
```
$ wrk http://127.0.0.1:2048/v1
Running 10s test @ http://127.0.0.1:2048/v1
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   832.37us  217.49us   4.91ms   70.42%
    Req/Sec     6.38k     1.05k    9.78k    75.36%
  120081 requests in 10.00s, 14.54MB read
Requests/sec:  12008.41
Transfer/sec:      1.45MB

$ wrk http://127.0.0.1:2048/v1/hello
Running 10s test @ http://127.0.0.1:2048/v1/hello
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.91ms  301.47us   4.45ms   72.08%
    Req/Sec     5.95k     1.22k    9.78k    72.87%
  113005 requests in 10.00s, 13.69MB read
Requests/sec:  11301.01
Transfer/sec:      1.37MB

$ wrk http://127.0.0.1:2048/v1/user/123
Running 10s test @ http://127.0.0.1:2048/v1/user/123
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.02ms  280.66us   6.61ms   73.87%
    Req/Sec     5.20k   843.66     8.22k    74.29%
  98300 requests in 10.00s, 11.91MB read
Requests/sec:   9830.29
Transfer/sec:      1.19MB

$ wrk http://127.0.0.1:2048/v1/user/status/123
Running 10s test @ http://127.0.0.1:2048/v1/user/status/123
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.03ms  398.93us   8.79ms   93.82%
    Req/Sec     5.21k     0.99k    8.44k    72.60%
  98501 requests in 10.00s, 11.93MB read
Requests/sec:   9850.42
Transfer/sec:      1.19MB

$ wrk http://127.0.0.1:2048/v1/register/status/123
Running 10s test @ http://127.0.0.1:2048/v1/register/status/123
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.04ms  398.05us  12.47ms   92.14%
    Req/Sec     5.20k     0.99k    8.33k    77.50%
  98513 requests in 10.00s, 11.93MB read
Requests/sec:   9851.47
Transfer/sec:      1.19MB

$ wrk http://127.0.0.1:2048/v1/emails/gmail
Running 10s test @ http://127.0.0.1:2048/v1/emails/gmail
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.00ms  261.27us   8.11ms   68.65%
    Req/Sec     5.33k     0.95k    8.78k    75.76%
  100780 requests in 10.00s, 12.21MB read
Requests/sec:  10078.20
Transfer/sec:      1.22MB

$ wrk http://127.0.0.1:2048/v1/time/+12
Running 10s test @ http://127.0.0.1:2048/v1/time/+12
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.93ms  230.99us   5.22ms   70.00%
    Req/Sec     5.67k     0.93k    8.78k    76.29%
  107204 requests in 10.00s, 12.98MB read
Requests/sec:  10720.82
Transfer/sec:      1.30MB
```

* Checkout https://github.com/herenow/node-router-benchmarks for all benchmarks on the node.js routers I used as references.


Conclusion
-----------
Light-router is in an alpha version and it seems to be working fine, it seems to be fast even with no caching layer, and maybe I'll remove the caching layer in a later version.

Notes:
* Read the file `lib/router.js` to get a better understanding of how requests are routed to their handlers
* Complex RegExp are slow, if you can dont use them to much :)
