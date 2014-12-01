module.exports = function (server, db, shortId, mongojs) {
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

    server.get('/api/v1/goter/pin-searches/:id/comments', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.pinS_comments.find(
                { pinS_id : mongojs.ObjectId(req.params.id) },
                function (err, docs) {
                    if (err) { console.log("err: "+err );
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(docs));
                    }
                }
            );
        })
        return next();
    });

    server.post( '/api/v1/goter/pin-searches/:id/comments', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.appUsers.findOne({email: req.params.user}, function (err, user) {
                if (!err) {
                    // basado en la primera opción de http://docs.mongodb.org/ecosystem/use-cases/storing-comments/
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

                    var comment = { 'pinS_id'  : mongojs.ObjectId(req.params.id),      
                                    'user_id'   : user._id,
                                    'user_email': user.email,
                                    'user_name' : user.name,
                                    'text'      : req.params.comment,
                                    'posted'    : date,
                                    'parent_id' : parent_id,
                                    'slug'      : slug,
                                    'full_slug' : full_slug  };
                    
                    db.pinS_comments.save( comment, 
                        function (err, data) {
                        if (!err){  
                            db.pinS_comments.findOne({'full_slug' : full_slug}, function (err, doc) {
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
}