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

}