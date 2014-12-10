//var androidService = require("/android-service.js");

angular.module('goter.controllers', ['goter.services'])

.controller('HomeController', function($rootScope, $scope, $window, API, $ionicModal) {

    $scope.name = $window.localStorage.token;

    $scope.search_word = "";
    $scope.search_pins = "";

    $scope.search = function() {

        var search_word = this.search_word;
        var email = $scope.name;
        var radio = $scope.radio;
        var search_pins = this.search_pins;
      
        var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 10000 };
        navigator.geolocation.getCurrentPosition(function(pos) {

            var my_location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };

           if(search_word == ''){

            API.getAllOffers(email, my_location, radio).success(function(data) {

                        //$rootScope.set(data);
                        $rootScope.setSearchResults(data);
                        $window.location.href = ('#/default/search');
                        $rootScope.radio = radio;
                        $rootScope.search_pins = search_pins;
                        

                    }).error(function(error) {

                        $rootScope.hide();

                    });
            }
            else{

                 if(search_pins == false){

                    API.getSearchResults(email, search_word, my_location, radio).success(function(data) {

                        //$rootScope.set(data);
                        $rootScope.setSearchResults(data);
                        $window.location.href = ('#/default/search');
                        $rootScope.search_word = search_word;
                        $rootScope.radio = radio;
                        $rootScope.search_pins = search_pins;
                        


                    }).error(function(error) {

                        $rootScope.hide();

                    }); 
                } 

                else{

                   
                    API.getSearchPinsResults(email, search_word, my_location, radio).success(function(data) {

                        //$rootScope.set(data);
                        $rootScope.setSearchResults(data);
                        $window.location.href = ('#/default/search');
                        $rootScope.search_word = search_word;
                        $rootScope.radio = radio;
                        $rootScope.search_pins = search_pins;
                        
                    }).error(function(error) {
                        $rootScope.hide();
                }); 
                }
            }
                }, function(error) {
            alert('Unable to get location: ' + error.message);
        },options);
    }

    $scope.searchType = function(type) {

        var email = $scope.name;
        var radio = $scope.radio;
        var search_word = type;

        var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 10000 };
        navigator.geolocation.getCurrentPosition(function(pos) {

            var my_location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };


            API.getSearchResultsByType(email, search_word, my_location, radio).success(function(data) {

                //$rootScope.set(data);
                $rootScope.setSearchResults(data);
                $window.location.href = ('#/default/search');
                $rootScope.radio = radio;
                $rootScope.search_pins = false;


            }).error(function(error) {
                $rootScope.hide();

            }); 
            

        }, function(error) {
            alert('Unable to get location: ' + error.message);
        },options);
            

    }

    $ionicModal.fromTemplateUrl('templates/radio.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.confirmRadio = function(radio){
        $scope.radio = radio;
        $scope.modal.hide();
    }

    $scope.radio = 10;
    //ASUpdateToken($scope.name);
})

.controller('searchCtrl', function($rootScope, $scope, $window, API, $ionicModal) {
    $scope.name = $window.localStorage.token;
    $scope.search_word = $rootScope.search_word;
    $scope.radio = $rootScope.radio;
    $scope.search_pins = $rootScope.search_pins;
    delete $rootScope.search_word;
    delete $rootScope.radio;
    delete $rootScope.search_pins;
    var results = $rootScope.getSearchResults();
    $scope.results = results;

    $scope.getOffer = function(offer) {
        var idOffer = offer._id;
        if($scope.search_pins == false){
            API.getOffer(idOffer, $scope.name).success(function(data) {
                $scope.offer = data;
                $rootScope.search_word = $scope.search_word;
                $rootScope.radio = $scope.radio;
                $rootScope.search_pins = $scope.search_pins;
                $rootScope.set(data);
                $window.location.href = ('#/default/offer');
            }).error(function(error) {
                $rootScope.hide();
            });
        }else{
            API.getPinSearch(idOffer, $scope.name).success(function(data) {
                $scope.offer = data;
                $rootScope.search_word = $scope.search_word;
                $rootScope.radio = $scope.radio;
                $rootScope.search_pins = $scope.search_pins;
                $rootScope.set(data);
                $window.location.href = ('#/default/pin-search');
            }).error(function(error) {
                $rootScope.hide();
            });
        }
    }

    $scope.pinSearch = function () {

        var search = this.search_word;
        $rootScope.set(search);
        $window.location.href = ('#/default/new/pin/search');
    }

    $scope.search = function() {

        var search_word = this.search_word;
        var email = $scope.name;
        var radio = $scope.radio;
        var search_pins = this.search_pins;


        var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 10000 };
        navigator.geolocation.getCurrentPosition(function(pos) {

            var my_location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };


            if(search_pins == false){
                
                
                API.getSearchResults(email, search_word, my_location, radio).success(function(data) {

                    $scope.results = data;
                    $rootScope.setSearchResults(data);
                    $window.location.href = ('#/default/search');
                    $rootScope.hide();

                }).error(function(error) {
                    $rootScope.hide();

                }); 
            } 

            else{
              
                API.getSearchPinsResults(email, search_word, my_location, radio).success(function(data) {
                    $scope.results = data;
                    $rootScope.setSearchResults(data);
                    $window.location.href = ('#/default/search');
                    $rootScope.hide();

                }).error(function(error) {
                    $rootScope.hide();
                }); 
            }


        }, function(error) {
            alert('Unable to get location: ' + error.message);
        },options);
    }

    $scope.getLocation = function(offer) {

        $rootScope.set(offer);
        $window.location.href = ("#/default/offer/location");
    }

    $ionicModal.fromTemplateUrl('templates/radio.html', {
        scope: $scope
    }).then(function(modal) {
    $scope.modal = modal;
  });

    $scope.confirmRadio = function(radio){
        $scope.radio = radio;
        $scope.modal.hide();
    }

    $scope.getMap = function(results){
        $rootScope.set(results);
        $window.location.href = ("#/default/search/map");
    }


})

.controller('searchMapCtrl', function($rootScope, $scope, $window, $timeout, $compile) {


   var results = $rootScope.get();

   var marker = null;

   var mapOptions = {
        zoom: 15,
        zoomControl : false,
        streetViewControl: false,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };


   var map = new google.maps.Map(document.getElementById("map"), mapOptions);

   var markers = [];

   results.forEach(function(entry){


        var point = new google.maps.LatLng(entry.location.lat,entry.location.lng);

        if(entry.type == 'product'){
            markers.push(new google.maps.Marker({
                position: point,
                map: map,
                animation: google.maps.Animation.BOUNCE,
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }));
        }

        else if (entry.type == 'event'){
            markers.push(new google.maps.Marker({
                position: point,
                map: map,
                animation: google.maps.Animation.BOUNCE,
                icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
            }));


        }

        else if (entry.type == 'service'){
            markers.push(new google.maps.Marker({
                position: point,
                map: map,
                animation: google.maps.Animation.BOUNCE,
                icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
            }));

        }

        else{
            markers.push(new google.maps.Marker({
                position: point,
                map: map,
                animation: google.maps.Animation.BOUNCE,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }));

        }

        var contentString = "<div>"+entry.title+"</div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

        var last = markers[markers.length - 1];
        //google.maps.event.addListener(last, 'click', function() {
           infowindow.open(map, last);
        //});
    
   });




   function autoUpdate() {
      navigator.geolocation.getCurrentPosition(function(position) {  
        var newPoint = new google.maps.LatLng(position.coords.latitude, 
          position.coords.longitude);

       
        if (marker) {
      // Marker already created - Move it
      marker.setPosition(newPoint);
  }
  else {
    // Center the map on the new position
    map.setCenter(newPoint);
      // Marker does not exist - Create it
      marker = new google.maps.Marker({
        position: newPoint,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
  }

    
}); 

  // Call the autoUpdate() function every 1 seconds
  var timer = $timeout(autoUpdate, 1000);

  if(window.location.href == 'http://localhost:8100/#/default/search/map'){
  }
  else{

    $timeout.cancel(timer);
  }
  
}

autoUpdate();


    /*var watchID;
    var geoLoc;

    if(navigator.geolocation){
          // timeout at 60000 milliseconds (60 seconds)
          var options = { frequency: 3000 };
          geoLoc = navigator.geolocation;
          watchID = geoLoc.watchPosition(showLocation, 
             errorHandler, options);
          
    }else{
          alert("Sorry, browser does not support geolocation!");
    }

    function showLocation(position) {

        console.log("entreaqui");
        var newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
        if (marker) {
            // Marker already created - Move it
            marker.setPosition(newPoint);
        }
        else {
            // Marker does not exist - Create it
            marker = new google.maps.Marker({
                position: newPoint,
                map: map
            });
        }

        map.setCenter(newPoint);
    }

    function errorHandler(err) {
          if(err.code == 1) {
            alert("Error: Access is denied!");
        }else if( err.code == 2) {
            alert("Error: Position is unavailable!");
        }
    }*/

    
})

.controller('OfferNewTypeCtrl', function($scope) {
    //console.log("OfferNewTypeCtrl cargado");
})

.controller('SignInCtrl', function($rootScope, $scope, API, $window) {

    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/default/home');
    }

    $scope.user = { email   :'' ,
                    password:'' }

    $scope.validateUser = function() {
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
            $rootScope.notify("Please enter valid credentials");
            return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            email: email,
            password: password
        }).success(function(data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            //ASUpdateToken(email);
            $window.location.href = ('#/default/home');
        }).error(function(error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
})

.controller('SignUpCtrl', function($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };

    $scope.createUser = function() {
        var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if (!email || !password || !uName) {
            $rootScope.notify("Please enter valid data");
            return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function(data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/default/home');
        }).error(function(error) {
            $rootScope.hide();
            if (error.error && error.error.code == 11000) {
                $rootScope.notify("A user with this email already exists");
            } else {
                $rootScope.notify("Oops something went wrong, Please try again!");
            }

        });
    }
})

.controller('myOffersCtrl', function($rootScope, $scope, API, $window) {

    $scope.getOffer = function(offer) {

        var idOffer = this.offer._id;
        var email = $window.localStorage.token;

        API.getOffer(idOffer, email).success(function(data) {

            $scope.offer = data;
            // console.log("data "+JSON.stringify(data));
            $rootScope.set(data);
            $window.location.href = ('#/default/offer');

        }).error(function(error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }

    $scope.edit = function(offer) {    
    }

    $scope.delete = function(offer) {

        var email = $window.localStorage.token;
        API.deleteOffer(offer._id, email).success(function(data) {
            $window.location.reload();
        }).error(function(error) {
            $rootScope.hide();
        });
    }

    API.getOffers($rootScope.getToken()).success(function(data, status, headers, config) {
        $scope.offers = data;
    }).error(function(data, status, headers, config) {
        $rootScope.hide();
        $rootScope.notify("Oops something went wrong!! Please try again later");
    });

    
})

.controller('myPinSearchsCtrl', function($rootScope, $scope, API, $window) {

    $scope.getPinSearch = function(pin_search) {

        var id_pin_search = this.pin_search._id;
        var email = $window.localStorage.token;

        API.getPinSearch(id_pin_search, email).success(function(data) {
            //$scope.offer = data;
            $rootScope.set(data);
            $window.location.href = ('#/default/pin-search');


        }).error(function(error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }

    API.getPinSearchs($rootScope.getToken()).success(function(data, status, headers, config) {
        $scope.pin_searchs = data;
    }).error(function(data, status, headers, config) {
        $rootScope.hide();
        $rootScope.notify("Oops something went wrong!! Please try again later");
    });
})

.controller('pinSearchCtrl', function($rootScope, $scope, API, $window, $ionicLoading, $compile) {

    $scope.pin_search = $rootScope.get();
    
    var myLatlng = new google.maps.LatLng($scope.pin_search.location.lat, $scope.pin_search.location.lng);
    var mapOptions = {
        center: myLatlng,
        zoom: 17,
        zoomControl : false,
        streetViewControl: false,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-2"), mapOptions);

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
        infowindow.open(map, marker);
    });
    $scope.map = map;
})

.controller('pinSearchCommentsCtrl', function ($rootScope, $scope, API, $window) {
    $scope.pin_search = $rootScope.get();

    API.getPinSearchComments($scope.pin_search._id, $rootScope.getToken())
    .success(function (data, status, headers, config) {
        $scope.pin_search.comments = data;
    })
    .error( function (data, status, headers, config) {
        $rootScope.hide();
        $rootScope.notify("Oops something went wrong!! Please try again later");
    });

    $scope.saveComment = function() {
        var ncomment = this.newcomment;
        this.newcomment = '';
        API.savePinSearchComment($scope.pin_search._id, {
                user: $rootScope.getToken(),
                comment: ncomment
            }, $rootScope.getToken())
        .success(function(data, status, headers, config) {
            console.log("data "+data);
            if (!$scope.pin_search.comments) $scope.pin_search.comments = [];
            $scope.pin_search.comments.push(data);
            $rootScope.set($scope.pin_search);
        })
        .error(function(data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    };

    $scope.saveResponse = function(commentId, commentSlug, commentFullSlug) {
        API.saveOfferComment($scope.pin_search._id,{
                user            : $rootScope.getToken(),
                comment         : this.response,
                parent_id       : commentId,
                parent_slug     : commentSlug,
                parent_full_slug: commentFullSlug
            }, $rootScope.getToken())
        .success(function(data, status, headers, config) {
        })
        .error(function(data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    };
})

.controller('offerCtrl', function($rootScope, $scope, API, $window) {

    $scope.offer = $rootScope.get();
    
    if ($scope.offer.liked == true){
        $scope.offer.likeStyle = "assertive";
        $scope.offer.likeState = true;
    }else{
        $scope.offer.likeStyle = "dark";
        $scope.offer.likeState = false;
    }
    
    $scope.getLocation = function(offer) {

        $rootScope.set(offer);
        $window.location.href = ("#/default/offer/location");
    }

    $scope.likeFunction = function(offer) {

        var form = { offer: $scope.offer };

        if ($scope.offer.liked == false) {

            API.likeOffer( $scope.offer._id , $rootScope.getToken() )
            .success( function (data, status, headers, config) {

                $scope.offer.likeStyle = "assertive";
                $scope.offer.likeState = true;
                $scope.offer.liked = true;
                form.offer.likes += 1;

                API.updateOffer($scope.offer._id, form, $rootScope.getToken())
                .success( function ( data, status, headers, config ) {
                    
                    //$scope.offer.likes += 1;
                    //console.log("succeslike");
                })
                .error(function(data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
            })
            .error(function (data, status, headers, config) {
                console.log("error");
            });

        } else {
            
            API.dislikeOffer( $scope.offer._id, $rootScope.getToken() )
            .success( function (data, status, headers, config) {
                $scope.offer.likeStyle = "dark";
                $scope.offer.likeState = false;
                $scope.offer.liked = false;
                form.offer.likes -= 1;

                API.updateOffer( $scope.offer._id, form, $rootScope.getToken() )
                .success( function ( data, status, headers, config ) {
                    
                    //$scope.offer.likes -= 1;
                    //console.log("succeslike");
                })
                .error( function(data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });
            })
            .error( function (data, status, headers, config) {
                console.log("error");
            });
        }  
    }
})

.controller('OfferCommentsCtrl', function($rootScope, $scope, API, $window) {
    $scope.offer = $rootScope.get();

    API.getOfferComments($scope.offer._id, $rootScope.getToken())
    .success(function (data, status, headers, config) {
        //console.log("data"+data);
        $scope.offer.comments = data;
    })
    .error( function (data, status, headers, config) {
        $rootScope.hide();
        $rootScope.notify("Oops something went wrong!! Please try again later");
    });

    $scope.saveComment = function() {
        var ncomment = this.newcomment;
        this.newcomment = '';
        API.saveOfferComment($scope.offer._id, {
                user: $rootScope.getToken(),
                comment: ncomment
            }, $rootScope.getToken())
        .success(function(data, status, headers, config) {
            //console.log("data "+data);
            if (!$scope.offer.comments) $scope.offer.comments = [];
            $scope.offer.comments.push(data);
            $rootScope.set($scope.offer);
        })
        .error(function(data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    };



    $scope.saveResponse = function(commentId, commentSlug, commentFullSlug) {
        //console.log("commentid "+commentId+" "+commentSlug);
        //console.log(this.response);
        //console.log(angular.element);
        API.saveOfferComment($scope.offer._id,{
                user            : $rootScope.getToken(),
                comment         : this.response,
                parent_id       : commentId,
                parent_slug     : commentSlug,
                parent_full_slug: commentFullSlug
            }, $rootScope.getToken())
        .success(function(data, status, headers, config) {
            //console.log("érsito");
            
        })
        .error(function(data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    };
})


.controller('newOfferCtrl', function($rootScope, $scope, API, $window, $ionicLoading, $compile) {


    if (!$rootScope.offer) $rootScope.offer = {"likes": 0};
    $rootScope.offer.user = $window.localStorage.token;
    $scope.offer = $rootScope.offer;

    if ($rootScope.offer.location) $scope.locationInput = $rootScope.offer.location.lat + " " + $rootScope.offer.location.lng;

    $scope.saveForm = function(offer) {
        $rootScope.offer = this.offer;
    };


    /*ionic.Platform.ready(function() {
        console.log("ready get camera types");

        if (!navigator.camera)
        {
            console.log("cam error");
            // error handling
            return;
        }
        //pictureSource=navigator.camera.PictureSourceType.PHOTOLIBRARY;
        pictureSource   = navigator.camera.PictureSourceType.CAMERA;
        destinationType = navigator.camera.DestinationType.FILE_URI;
    });

    // take picture
    $scope.takePicture = function() {
        //console.log("got camera button click");
        var options =   {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: 0
        };
        if (!navigator.camera)
        {
            // error handling
            return;
        }
        navigator.camera.getPicture(
            function (imageURI) {
                //console.log("got camera success ", imageURI);
                $scope.offer.image = imageURI;
                $window.location.href = ('#/default/new/offer/description');
            },
            function (err) {
                //console.log("got camera error ", err);
                // error handling camera plugin
            },
            options);
    };*/
})

.controller('newOfferLocationCtrl', function($rootScope, $scope, API, $window, $ionicLoading, $compile) {
    if (!$rootScope.offer) $rootScope.offer = {"likes": 0};
    $rootScope.offer.user = $window.localStorage.token;
    $scope.offer = $rootScope.offer;



    if ($rootScope.offer.location) $scope.locationInput = $rootScope.offer.location.lat + " " + $rootScope.offer.location.lng;

    $scope.saveForm = function(offer) {
        $rootScope.offer = this.offer;
    };

    $scope.centerOnMe = function() {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 10000 };

        navigator.geolocation.getCurrentPosition(function(pos) {

            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();

            $rootScope.offer.location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            $scope.offer.location = $rootScope.offer.location;
            $scope.locationInput = $rootScope.offer.location.lat + " " + $rootScope.offer.location.lng;

            var newLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            marker.setMap(null);
            marker = new google.maps.Marker({
                position: newLatlng,
                map: map,
                draggable: true,
                title: "Arrastrame!"
            });

        }, function(error) {
            alert('Unable to get location: ' + error.message);
        },options);
    /*$scope.searchPosition = function() {
        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        $rootScope.offer.location = {
            lat: lat,
            lng: lng   };
        $scope.offer.location = $rootScope.offer.location;
    };*/
    }

    $scope.publishOffer = function() {
        //if (
        //    $scope.offer.title && $scope.offer.type && $scope.offer.title && $scope.offer.description &&
        //    $scope.offer.tags && $scope.offer.length && $scope.offer.location  
        //    )
        //{
            
        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        $rootScope.offer.location = {
            lat: lat,
            lng: lng
        };
        $scope.offer.location = $rootScope.offer.location;


        /*var ft = new FileTransfer(),
                options = new FileUploadOptions();



        options.fileKey  = "ffile";
        options.fileName = "nombre_random";
        options.mimeType = "image/jpeg";*/
        
        /*var params = {};
        params.other = obj.text; // some other POST fields
        options.params = params;*/

        /*
    
        ft.upload($scope.offer.image, "http://goter.herokuapp.com/images", uploadSuccess, uploadError, options);
        function uploadSuccess(r) {
            // handle success like a message to the user
            console.log("exito");
        }
        function uploadError(error) {
            //console.log("upload error source " + error.source);
            //console.log("upload error target " + error.target);

            }*/
      


        var form = {
            offer: $scope.offer
        };

        API.saveOffer(form.offer.user, form)
            .success(function(data, status, headers, config) {
                //$rootScope.setToken(email); // create a session kind of thing on the client side
                delete $rootScope.offer;
                $rootScope.hide();
                $window.location.href = ('#/default/home');
            })
            .error(function(data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    }

    var myLatlng = {};
    if (!$rootScope.offer.location) myLatlng = new google.maps.LatLng(-33.448906, -70.681905);
    else myLatlng = new google.maps.LatLng($rootScope.offer.location.lat, $rootScope.offer.location.lng);

    var mapOptions = {
        center: myLatlng,
        zoom: 15,
        zoomControl : false,
        streetViewControl: false,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map-2"), mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>{{offer.title}}</a></div>";
    var compiled = $compile(contentString)($scope);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true,
        title: "Arrastrame!"
    });

    var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });

    $scope.map = map;

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */ (
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input));

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
                draggable: true,
                title: "Arrastrame!"
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

.controller('locationCtrl', function($scope, $ionicLoading, $compile, $rootScope, API, $window) {

    /*function initialize() {*/
    $scope.offer = $rootScope.get();

    var myLatlng = new google.maps.LatLng($scope.offer.location.lat, $scope.offer.location.lng);

    var mapOptions = {
        center: myLatlng,
        zoom: 17,
        zoomControl : false,
        streetViewControl: false,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

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
        infowindow.open(map, marker);
    });

    $scope.map = map;

    /*}
    google.maps.event.addDomListener(window, 'load', initialize);*/

/*    $scope.centerOnMe = function() {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 10000 };
        
        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        },options);
    };*/

    $scope.clickTest = function() {
        alert("Descripción: " + $scope.offer.description);
    };

})

.controller('newPinCtrl', function($rootScope, $scope, API, $window) {

    if ($rootScope.pin_search) {

        $scope.pin_search = $rootScope.get();   
    } 

    else {

        var location = {
                lat: -33.448906 ,
                lng: -70.681905 
        };

        $scope.pin_search = {

        title: $rootScope.get(),
        description: "",
        tags: "",
        frequency: "",
        anonymous: "",
        next_to_me: "",
        location: location,
        user: $window.localStorage.token
        };
    };

    delete $rootScope.pin_search;

    $scope.pinLocation = function () {

        $rootScope.set($scope.pin_search);
        $window.location.href = ('#/default/new/pin/search/location');
    };

    $scope.publishPinSearch = function() {
       
        var form = {
            pin_search: $scope.pin_search
        };

        var user = $window.localStorage.token;

        API.savePinSearch(user, form)
            .success(function(data, status, headers, config) {

                $window.location.href = ('#/default/home');
            })
            .error(function(data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
      
    };

})


.controller('newPinLocationCtrl', function($rootScope, $scope, API, $window, $ionicLoading, $compile) {

    $scope.pin_search = $rootScope.get();

    var myLatlng = {};
    myLatlng = new google.maps.LatLng($scope.pin_search.location.lat, $scope.pin_search.location.lng);

    var mapOptions = {

        center: myLatlng,
        zoom: 15,
        zoomControl : false,
        streetViewControl: false,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map-2"), mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>{{offer.title}}</a></div>";
    var compiled = $compile(contentString)($scope);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true,
        title: "Arrastrame!"
    });

    var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });

    $scope.map = map;
    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */ (
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input));

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
                draggable: true,
                title: "Arrastrame!"
            });


            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

    $scope.centerOnMe = function() {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 10000 };

        navigator.geolocation.getCurrentPosition(function(pos) {

            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();

            $scope.pin_search.location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };


            var newLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            marker.setMap(null);
            marker = new google.maps.Marker({
                position: newLatlng,
                map: map,
                draggable: true,
                title: "Arrastrame!"
            });

        }, function(error) {
            alert('Unable to get location: ' + error.message);
        },options);
    };

    $scope.searchPosition = function() {

        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        $scope.pin_search.location = {
            lat: lat,
            lng: lng
        };
    };

    $scope.ready = function() {

        $rootScope.pin_search = $scope.pin_search;
        $rootScope.set($scope.pin_search);
        $window.location.href = ('#/default/new/pin/search');
    }
})

.controller('NotificationsCtrl',function ($rootScope, $scope) {
    /*$scope.getToken = function () {
        //if ( !USGetToken() ){
            console.log("hola desde NotificationsCtrl");
            return $rootScope.getToken()
        //}
    }*/
})
;
