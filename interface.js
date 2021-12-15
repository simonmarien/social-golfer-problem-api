const restify = require('restify');

//Config
let server = restify.createServer({
    name: 'social-golfer-problem',
    version: '1.0.0'
});
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    requestBodyOnGet: true
}));

const port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});


/**
 * Get request for social golfer problem api
 *
 */
server.get('/', function (req, res, next) {
    //Check for content-type
    if (!req.is('json')) {
        res.status(415)
        return next(res.send('content-type: application/json required'));
    }

    console.log(req.body)
    res.send('home')
    return next()
})