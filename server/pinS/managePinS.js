module.exports = function (server, db) {
    var validateRequest = require("../auth/validateRequest");


    server.post('/api/v1/goter/pin-searchs', function (req, res, next) {
        
        console.log("validate: ");
        validateRequest.validate(req, res, db, function () {



            var pinS = req.params.pin_search;
            //console.log(pinS);

            db.pinS.save(pinS,
                function (err, data) {
                    if (err){
                        console.log("err "+err );
                    }
                    else{
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });

                        res.end(JSON.stringify(data));
                    }
                });
        });
        return next();
    });

    server.get("/api/v1/goter/pin-searchs", function (req, res, next) {
        validateRequest.validate(req, res, db, function () {

            db.pinS.find({
                user : req.params.token
                },function (err, docs) {
                    if (err){
                        console.log("err: "+err );
                    }else{
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(docs));
                }
            });

       
        });
        return next();
    });

    server.get('/api/v1/goter/pin-search/:id', function (req, res, next) {

        
        validateRequest.validate(req, res, db, function () {
            db.pinS.findOne({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
                
            });

        });
        return next();
    });

}