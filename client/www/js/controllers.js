angular.module('goter.controllers', ['goter.services'])

.controller('HomeController', function ($rootScope, $scope, $window) {

    $scope.name = $window.localStorage.token;

    $scope.search_word = "";

    $scope.search = function () {

        var search_word = this.search_word;
    
        //aca manda la palabra al server
        $window.location.href = ('#/default/search');
    }

    $scope.getOffer = function (id) {
    
        //aca manda la id al server para obtener la oferta
        $window.location.href = ('#/default/offer');
    }
    
})

.controller('OfferNewTypeCtrl', function($scope) {
    console.log("OfferNewTypeCtrl cargado");
})

.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his bucketlist
    if ($rootScope.isSessionActive()) {
        
        $window.location.href = ('#/default/home');
    }
 
    $scope.user = {
        email: "",
        password: ""
    };
 
    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
        	$rootScope.notify("Please enter valid credentials");
        	return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/default/home');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
 
})

.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };

    $scope.createUser = function () {
    	var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
        	$rootScope.notify("Please enter valid data");
        	return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/default/home');
        }).error(function (error) {
            $rootScope.hide();
        	if(error.error && error.error.code == 11000)
        	{
        		$rootScope.notify("A user with this email already exists");
        	}
        	else
        	{
        		$rootScope.notify("Oops something went wrong, Please try again!");
        	}
            
        });
    }
})

.controller('myOffersCtrl', function ($rootScope, $scope, API, $window) {

    $scope.getOffer = function (offer) {

        var idOffer = this.offer._id;
        var email = $window.localStorage.token;
        
        API.getOffer(idOffer,email).success(function (data) {

            
            $scope.offer = data; 
            $rootScope.set(data);
            $window.location.href = ('#/default/offer');
            

        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }

    API.getOffers($rootScope.getToken()).success(function (data, status, headers, config) {
        $scope.offers = data;
    }).error(function (data, status, headers, config) {
        $rootScope.hide();
        $rootScope.notify("Oops something went wrong!! Please try again later");
    });
})

.controller('offerCtrl', function ($rootScope, $scope) {
   
   

    $scope.offer = $rootScope.get();

    console.log($rootScope.get());
    
    
})

.controller('newOfferCtrl', function ($rootScope, $scope, API, $window) {
    if (!$rootScope.offer) $rootScope.offer = {};
    $rootScope.offer.user = $window.localStorage.token;
    $scope.offer = $rootScope.offer;

    $scope.saveForm = function (offer) {
        $rootScope.offer = this.offer;
    }
    $scope.getPos = function () {
        var onSuccess = function(position) {
        /*alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');*/
            $rootScope.offer.location = {lat: position.coords.latitude, lng: position.coords.longitude};
            $scope.offer.location = $rootScope.offer.location;
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    $scope.publishOffer = function(){
        //if (
        //    $scope.offer.title && $scope.offer.type && $scope.offer.title && $scope.offer.description &&
        //    $scope.offer.tags && $scope.offer.length && $scope.offer.location  
        //    )
        //{
            var form = {
                offer: $scope.offer
            }
            API.saveOffer(form.offer.user, form)
                .success(function (data, status, headers, config) {
                    //$rootScope.setToken(email); // create a session kind of thing on the client side
                    delete $rootScope.offer;
                    $rootScope.hide();
                    $window.location.href = ('#/default/home');
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
            });
        //}else{
        //    alert('Faltan campos por rellenar ;D');
        //    console.log("offer "+JSON.stringify($scope.offer));
        //}
    }
})

;