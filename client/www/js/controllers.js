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

.controller('offerCtrl', function ($rootScope, $scope, API, $window) {

    $scope.offer = $rootScope.get();
    /*$scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };*/

    $scope.getLocation = function (offer) {
            
        $rootScope.set(offer);
        $window.location.href = ("#/default/offer/location");
        
    }

})

.controller('newOfferCtrl', function ($rootScope, $scope, API, $window, $ionicLoading, $compile) {
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


    $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();

          $rootScope.offer.location = {lat: pos.coords.latitude, lng: pos.coords.longitude};
          $scope.offer.location = $rootScope.offer.location;
         
          var newLatlng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
          marker.setMap(null);
          marker = new google.maps.Marker({
                position: newLatlng,
                map: map,
                draggable:true,
                title:"Arrastrame!"
            });;

        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });

        
      };

      $scope.searchPosition = function(){

            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            $rootScope.offer.location = {lat: lat, lng: lng};
            $scope.offer.location = $rootScope.offer.location;
      };

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
    };

    var myLatlng = new google.maps.LatLng(-33.448906,-70.681905);

    var mapOptions = {
        center: myLatlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map-2"),mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>{{offer.title}}</a></div>";
    var compiled = $compile(contentString)($scope);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable:true,
        title:"Arrastrame!"
    });

  

    var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
    });


    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });

    $scope.map = map;

   
    
 
     // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
   
    
    /*var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    var newLatlng = new google.maps.LatLng(lat,lng);*/
    

    // For each place, get the icon, place name, and location.
   
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      marker.setMap(null);
    marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                draggable:true,
                title:"Arrastrame!"
            });


      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });

  
    
    


})

.controller('locationCtrl', function ($scope, $ionicLoading, $compile, $rootScope, API, $window) {

      /*function initialize() {*/
        $scope.offer = $rootScope.get();

        var myLatlng = new google.maps.LatLng($scope.offer.location.lat,$scope.offer.location.lng);
        
        var mapOptions = {
            center: myLatlng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>{{offer.title}}</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Tooltip'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;

      /*}

      google.maps.event.addDomListener(window, 'load', initialize);*/
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert("Descripción: " + $scope.offer.description);
      };
      
    })

;