module.exports = function (server, db, shortId, mongojs, distance) {
    var validateRequest = require("../auth/validateRequest");

    server.post('/api/v1/goter/pin-searches', function (req, res, next) {
        
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

    server.get('/api/v1/goter/search-pins/:word', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.pinS.runCommand( 
                "text", {search: req.params.word, language: "spanish"}, 
                function (err, docs) {
                    if (err){
                        console.log("err: "+err );
                    }else{
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });

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