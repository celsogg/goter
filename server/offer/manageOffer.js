module.exports = function (server, db) {
    var validateRequest = require("../auth/validateRequest");

    server.get("/api/v1/goter/offers", function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.offers.find({
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

    server.get('/api/v1/goter/offer/:id', function (req, res, next) {

        
        validateRequest.validate(req, res, db, function () {
            db.offers.findOne({
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

    server.post('/api/v1/goter/offers', function (req, res, next) {
        console.log("validate: ");
        validateRequest.validate(req, res, db, function () {
            var offer = req.params.offer;
            db.offers.save(offer,
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

    server.put('/api/v1/goter/offer/:id/comment', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.offers.findOne(
                { _id: db.ObjectId(req.params.id) },
                function (err, data) {
                    db.offers.update(
                        { _id: db.ObjectId(req.params.id) },
                        { $addToSet: { comments: {user: req.params.user , comment: req.params.comment} } },
                        function (err, data) {
                            if (!err){
                                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                res.end(JSON.stringify(data));
                            }
                        }
                    );
                }
            );
        });
        return next();
    });

    /*server.del('/api/v1/goter/data/item/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.bucketLists.remove({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
            return next();
        });
    });*/

}