var restify  = require('restify');
var mongojs  = require('mongojs');
var	morgan   = require('morgan');
var shortId	 = require('shortid');
var distance = require('geo-distance');
var server   = restify.createServer();
//var db       = mongojs('goter',
var db       =   mongojs('mongodb://goter:goter@ds047440.mongolab.com:47440/goter',
						['appUsers','offers','pinS','offers_comments', 'offers_likes', 'pinS_comments']);
var fs = require('fs');


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({
    uploadDir: __dirname + '/uploads',
    keepExtensions: true
}));

server.use(restify.methodOverride());
server.use(restify.static(path.join(__dirname, './uploads')));

server.use(morgan('dev')); // LOGGER

// CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.listen(process.env.PORT || 9804, function () {
    console.log("Server started @ ", process.env.PORT || 9804);
});

var manageUsers = require('./auth/manageUser')   (server, db);
var manageLists = require('./list/manageList')   (server, db);
var manageOffer = require('./offer/manageOffer') (server, db, shortId, mongojs, distance, fs);
var managePinS  = require('./pinS/managePinS')   (server, db, shortId, mongojs);
