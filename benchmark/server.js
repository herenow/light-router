var router = require('../index.js')

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


/*
wrk http://127.0.0.1:2048/v1
wrk http://127.0.0.1:2048/v1/hello
wrk http://127.0.0.1:2048/v1/user/123
wrk http://127.0.0.1:2048/v1/user/status/123
wrk http://127.0.0.1:2048/v1/register/status/123
wrk http://127.0.0.1:2048/v1/emails/gmail
wrk http://127.0.0.1:2048/v1/time/+12
*/
