module.exports = function (server, db, shortId, mongojs, distance) {
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

    server.get('/api/v1/goter/offers/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.offers.findOne({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
                if (!err){
                    db.offers_likes.find(
                        {
                            offer_id: mongojs.ObjectId(req.params.id),
                            users_email: req.params.token
                        } ,
                    function (err2, data2){
                        if (!err2){
                            if ( data2.length > 0 ) data.liked = true;
                            else data.liked = false;
                            res.writeHead(200, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify(data));
                        } else {
                            console.log("err2 "+err2);
                        }
                    });
                } else console.log("err "+err);
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
                    } else {
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

    server.post('/api/v1/goter/offers/:id/liked/:user_email', function (req, res, next) {
        //console.log(req);
        validateRequest.validate(req, res, db, function () {
            
            db.offers_likes.findOne(
                { offer_id: db.ObjectId(req.params.id) },
                function (err, doc) {
                    console.log("doc "+doc);
                    if (!err){
                        if (doc){
                            db.offers_likes.update(
                                { offer_id: db.ObjectId(req.params.id) },
                                { $addToSet: { users_email: req.params.token} },
                                function (result) {
                                    console.log("paso");
                                    console.log("result "+result);
                                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                    res.end(JSON.stringify(result));
                                }
                            );
                        }else{
                            console.log("else");
                            db.offers_likes.save(
                                { offer_id: db.ObjectId(req.params.id), users_email: [ req.params.token ]},
                                function (err, data) {
                                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                    res.end(JSON.stringify(data));
                                }
                            );
                        }
                    }else{
                        console.log("err "+err);
                    }
                }
            );

            
            return next();
        });
    });

    server.post('/api/v1/goter/offers/:id/disliked/:user_email', function (req, res, next) {
        //console.log(req);
        validateRequest.validate(req, res, db, function () {
            
            db.offers_likes.findOne(
                { offer_id: db.ObjectId(req.params.id) },
                function (err, doc) {
                    console.log("doc "+doc);
                    if (!err){
                        if (doc){
                            db.offers_likes.update(
                                { offer_id: db.ObjectId(req.params.id) },
                                { $pull: { users_email: req.params.token } },
                                function (result) {
                                    console.log("dis");
                                    console.log("result "+JSON.stringify(result));
                                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                    res.end(JSON.stringify(result));
                                }
                            );
                        }
                    }else{
                        console.log("err "+err);
                    }
                }
            );

            
            return next();
        });
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

                        console.log(req.params.radio);

                        var result = [];
                        var i = 0;
                        docs.results.forEach(function(entry) {

                            var search_point = {
                                lon: req.params.lng,
                                lat: req.params.lat
                            }

                            var offer_point = {
                                lon: entry.obj.location.lng,
                                lat: entry.obj.location.lat
                            }

                            var dist = distance.between(search_point,offer_point);
                            entry.obj.distance = dist.human_readable();

                            if(entry.obj.distance.unit == 'km'){

                                if(parseFloat(entry.obj.distance.distance) <= parseFloat(req.params.radio)){

                                    result.push(entry.obj);
                                }
                            }

                            else{
                                
                                if(parseFloat(entry.obj.distance.distance) < parseFloat(req.params.radio)*1000){

                                    result.push(entry.obj);
                                }

                            }
                        });

                        result.sort(sort_by('distance', true, parseFloat));
                        

                        res.end(JSON.stringify(result));
                       
                    }
                }
            );
            
        });

        return next();
    });

    var sort_by = function(field, reverse, primer){

        var key = primer ? 
        function(x) {return primer(x[field])} : 
        function(x) {return x[field]};

        reverse = [-1, 1][+!!reverse];

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        } 
    }


}