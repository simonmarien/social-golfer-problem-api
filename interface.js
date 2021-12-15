const restify = require('restify')
const geneticSolver = require('./lib/geneticSolver')
var _ = require('underscore')


//Config
let server = restify.createServer({
    name: 'social-golfer-problem',
    version: '1.0.0'
});
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    requestBodyOnGet: true
}));

server.use(
    function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);

const port = process.env.PORT || 5000;
server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url);
});


/**
 * Get request for social golfer problem api
 *
 * {
    "names": ["Jan","Jos","Paul","Test"],
    "groups": 2,
    "forRounds": 3,
    "forbiddenPairs": [] //[[0,1]]
    }
 */
server.get('/', function (req, res, next) {
    //Check for content-type
    if (!req.is('json')) {
        res.status(415)
        return next(res.send('content-type: application/json required'));
    }
    const total = run(req.body.names, req.body.groups, req.body.forRounds, req.body.forbiddenPairs, (result) => {})
    //console.log(req.body)
    res.send(total)
    return next()
})

function run(names, groups, forRounds, forbiddenPairs){
    console.log(names)
    ofSize = Math.ceil(names.length/groups)
    console.log(groups)

    let result = geneticSolver(groups, ofSize, forRounds, forbiddenPairs, (result) => {})

    let ret = {groups: [], groupScores: []}

    console.log(result)
    result.forEach((e) => {
        /*
        {
            bestOption: { groups: [ [Array], [Array] ], groupsScores: [ 0, 0 ], total: 0 }
        }
         */

        //Fill in groups
        let list = []
        e.bestOption.groups.forEach(group => {
            let nested = []
            group.forEach(person => {
                nested.push(names[person])
            })
            console.log('GR',group)
            list.push(nested)
            ret.groups.push(list)
        })
        console.log('list',list)

        //Fill in groupScores
        list = []
        console.log(e.bestOption.groupsScores)
        e.bestOption.groupsScores.forEach(score => {
            list.push(score)
        })
        ret.groupScores.push(list)
    })

    return ret
}