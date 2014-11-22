module.exports = function (server, db, shortId, mongojs) {
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

    server.post( '/api/v1/goter/offers/:id/comments', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.appUsers.findOne({email: req.params.user}, function (err, user) {
                if (!err) {
                    // basado en la primera opción de http://docs.mongodb.org/ecosystem/use-cases/storing-comments/
                    //console.log("asd "+JSON.stringify(req.params));
                    
                    var slug_part = shortId.generate();
                    var date = new Date();
                    var full_slug_part = ''+date.getUTCFullYear()+'.'+date.getUTCMonth()+'.'+date.getUTCDate()+'.'+date.getUTCHours()+'.'+date.getUTCMinutes()+'.'+date.getUTCSeconds()+':'+slug_part;
                    var slug, full_slug, parent_id;

                    if (req.params.parent_slug){
                        slug = req.params.parent_slug + '/' + slug_part;
                        full_slug = req.params.parent_full_slug + '/' + full_slug_part;
                        parent_id = mongojs.ObjectId(req.params.parent_id);
                    } else {
                        slug = slug_part;
                        full_slug = full_slug_part;
                        parent_id = null;
                    }


                    var comment = { 'offer_id'  : mongojs.ObjectId(req.params.id),      
                                    'user_id'   : user._id,
                                    'user_email': user.email,
                                    'user_name' : user.name,
                                    'text'      : req.params.comment,
                                    'posted'    : date,
                                    'parent_id' : parent_id,
                                    'slug'      : slug,
                                    'full_slug' : full_slug  };
                    //console.log("comm "+JSON.stringify(comment));
                    
                    db.offers_comments.save( comment, 
                        function (err, data) {
                        if (!err){
                            
                            db.offers_comments.findOne({'full_slug' : full_slug}, function (err, doc) {
                                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8'  });
                                res.end(JSON.stringify(doc));
                            });
                            
                        } else { console.log("err "+err); }
                    });
                } else { console.log("err "+err); }
            })
        });
        return next();
    });

    server.get( '/api/v1/goter/offers/:id/comments', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.offers_comments.find({
                offer_id : mongojs.ObjectId(req.params.id)
                },function (err, docs) {
                    if (err){
                        console.log("err: "+err );
                    }else{
                        //console.log(JSON.stringify(docs));
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(docs));
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

    server.get('/api/v1/goter/offers/:id/comments', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.offers.findOne(
                { _id: db.ObjectId(req.params.id) },
                function (err, data) {
                    if (!err){
                        db.offers_comments.find(
                            { offer_id: db.ObjectId(req.params.id) },
                            function (err, data) {
                                if (!err){
                                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                    res.end(JSON.stringify(data));
                                } else console.log("Err "+err);
                            }
                        );
                    } else console.log("Err: "+err);
                }
            );
        });
        return next();
    });

    server.put('/api/v1/goter/offers/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function() {
            db.offers.findOne(
                { _id: db.ObjectId(req.params.id) },
                function (err, data) {
                    if (!err){
                    delete req.params.offer._id;
                    db.offers.update(
                        { _id: db.ObjectId(req.params.id) },
                         req.params.offer ,
                        function (err, data) {
                            if (!err){
                                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                res.end(JSON.stringify(data));
                            }else{
                                console.log("err- "+err);
                            }
                        }
                    );
                    }else{
                        console.log("err "+err);
                    }
                }
            );
        });
        return next();
    });

    server.del('/api/v1/goter/offer/delete/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.offers.remove({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
            return next();
        });
    });

    server.get('/api/v1/goter/search/:word', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.offers.runCommand( 
                "text", {search: req.params.word, language: "spanish"}, 
                function (err, docs) {
                    if (err){
                        console.log("err: "+err );
                    }else{
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        res.end(JSON.stringify(docs));
                    }
                }
            );
            
        });
        return next();
    });

}