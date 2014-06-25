light-router
============
[![Build Status](https://travis-ci.org/herenow/light-router.svg?branch=master)](https://travis-ci.org/herenow/light-router)

A router for node.js performance junkies :)


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
router.get('/v1/account/:user', function(req, res) {
  res.end('Hello, ' + req.params.user)
})
```

* Note that this module has a singleton design pattern.
* The only thing that this router does to the `req` object is attach params.


Features
----------
* **Hashtable based** routing
* **Cache layer** for faster delivery
* **Cache control** for setting cache max size and disabling cache for some routes
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


####route.cache(boolean)
Control the caching for this route, you should disable caching for highly dynamic routes.

```javascript
router.put('/v1/user/:id', handler).cache(false)
```


####router.notFound(handler)
Set a custom handler for the 404 not found.

```javascript
router.notFound(function(req, res) {
  res.statusCode = 404
  res.end('Sorry this page was not found :(')
})
```


####router.cache.maxSize(boolean)
Set the max cache table size of each http method, by default its set to **100**. Each http method has its own cache table, so the total cached routes you can have is: **maxSize * http_verbs**

```javascript
router.cache.maxSize(10)
```

####router.cache.clear()
Clear the cache table, maybe it could be useful :)

```javascript
router.cache.clear()
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

**Light-router server (w/ caching)**
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
$ wrk wrk http://127.0.0.1:2048/v1
Running 10s test @ http://127.0.0.1:2048/v1
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.86ms  216.85us   6.87ms   72.52%
    Req/Sec     6.13k     0.95k    9.44k    76.66%
  115756 requests in 10.00s, 14.02MB read
Requests/sec:  11575.97
Transfer/sec:      1.40MB

$ wrk http://127.0.0.1:2048/v1/hello
Running 10s test @ http://127.0.0.1:2048/v1/hello
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.86ms  209.52us   5.06ms   70.26%
    Req/Sec     6.11k     1.04k    9.67k    74.84%
  115478 requests in 10.00s, 13.99MB read
Requests/sec:  11545.18
Transfer/sec:      1.40MB

$ wrk http://127.0.0.1:2048/v1/user/123
Running 10s test @ http://127.0.0.1:2048/v1/user/123
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.94ms  285.31us   6.58ms   73.83%
    Req/Sec     5.66k     0.97k    8.89k    72.66%
  107428 requests in 10.00s, 13.01MB read
Requests/sec:  10743.19
Transfer/sec:      1.30MB

$ wrk http://127.0.0.1:2048/v1/user/status/123
Running 10s test @ http://127.0.0.1:2048/v1/user/status/123
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.96ms  312.75us   5.58ms   74.29%
    Req/Sec     5.58k     1.08k    8.89k    74.76%
  105655 requests in 10.00s, 12.80MB read
Requests/sec:  10565.86
Transfer/sec:      1.28MB

$ wrk http://127.0.0.1:2048/v1/register/status/123
Running 10s test @ http://127.0.0.1:2048/v1/register/status/123
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.92ms  230.68us   5.54ms   67.34%
    Req/Sec     5.73k     0.91k    8.78k    71.93%
  108483 requests in 10.00s, 13.14MB read
Requests/sec:  10848.77
Transfer/sec:      1.31MB

$ wrk http://127.0.0.1:2048/v1/emails/gmail
Running 10s test @ http://127.0.0.1:2048/v1/emails/gmail
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.97ms  324.00us   4.97ms   74.84%
    Req/Sec     5.54k     1.07k    8.78k    74.24%
  105006 requests in 10.00s, 12.72MB read
Requests/sec:  10500.70
Transfer/sec:      1.27MB

$ wrk http://127.0.0.1:2048/v1/time/+12
Running 10s test @ http://127.0.0.1:2048/v1/time/+12
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.86ms  202.36us   4.59ms   70.68%
    Req/Sec     6.12k     0.93k    9.33k    77.82%
  115900 requests in 10.00s, 14.04MB read
Requests/sec:  11590.44
Transfer/sec:      1.40MB
```


**Light-router server (no caching)**
```javascript
var router = require('light-router')

require('http').createServer(router).listen(2048)

function respond(req, res) {
  res.end('benchmark')
}

router.get('/v1', respond).cache(false)
router.get('/v1/hello', respond).cache(false)
router.get('/v1/user/:id', respond).cache(false)
router.get('/v1/user/status/:id', respond).cache(false)
router.get('/v1/register/status/:id([0-9])', respond).cache(false)
router.get('/v1/emails/:provider', respond).cache(false)
router.get('/v1/time/:gmt(^\\+[0-9]{1,2}$)', respond).cache(false)
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
