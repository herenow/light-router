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
var router = require('light-router')

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
Set the max cache table size of each http method, by default its set to **10,000**. Each http method has its own cache table, so the total cached routes you can have is: **maxSize * http_verbs**

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
TODO:
