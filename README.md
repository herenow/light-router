light-router
============
[![Build Status](https://travis-ci.org/herenow/light-router.svg?branch=master)](https://travis-ci.org/herenow/light-router)

A light node.js http request router, it doesn't use regexp for matching, thus doesn't support complex patterns. It aims for performance and a more implicit route declaration model. This module follows a singletone design pattern, see below.

* Note that this router is in an alpha version, I don't guarantee forward compatibility with future versions.


- Under development
----------

##TODO
- ~~Add cache layer~~
- ~~Think about adding regexp~~
- ~~Add all http methods to routing table~~
- ~~Remove url.parse dependencie, this thing is slow as hell!~~

**Tomorrow**

- ~~Implement a faster routing table for dynamic matches~~
- Write documentation and benchmarks
- Release alpha version
- Add optional custom 404 handler
