// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('goter', ['ionic', 'goter.controllers', 'goter.services'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {


	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

		// setup an abstract state for the tabs directive
	
<<<<<<< HEAD
		.state('auth', {
			url: "/auth",
			abstract: true,
			templateUrl: "templates/auth.html"
		})

		.state('auth.signin', {
			url: '/signin',
			views: {
				'auth-signin': {
					templateUrl: 'templates/auth-signin.html',
					controller: 'SignInCtrl'
				}
			}
		})
		.state('auth.signup', {
			url: '/signup',
			views: {
				'auth-signup': {
					templateUrl: 'templates/auth-signup.html',
					controller: 'SignUpCtrl'
				}
			}
		})

    //SIGN IN & UP
    .state('signin', {
      url: '/signin',
      templateUrl: 'templates/signin.html',
      controller: 'SignInCtrl'
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignUpCtrl'
    })

    //TABS
    .state('default', {
      url: "/default", 
      abstract: true,
      templateUrl: "templates/default.html"
    })

    .state('default.home', {
      url: '/home',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/home.html',
          controller: 'HomeController'  
        }
      }
    })

    .state('default.my-searchs', {
      url: '/my-publications/searchs',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/my-searchs.html'
        }
      }
    })

    .state('default.my-offers', {
      url: '/my-publications/offers',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/my-offers.html',
          controller: "myOffersCtrl"
        }
      }
    })

    .state('default.my-results', {
      url: '/my-notifications/results',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/my-results.html'
        }
      }
    })

    .state('default.my-comments', {
      url: '/my-notifications/comments',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/my-comments.html'
        }
      }
    })


    //Offer
    .state('new', {
      url: "/new", 
      abstract: true,
      templateUrl: "templates/new.html"
    })

    .state('new.offer-type', {
      url: '/offer/type',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'offer': {
          templateUrl: 'templates/offer-new-type.html',
          controller: "newOfferCtrl"
        }
      }
    })

    .state('new.offer-description', {
      url: '/offer/description',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'offer': {
          templateUrl: 'templates/offer-new-description.html',
          controller: "newOfferCtrl"
        }
      }
    })

    .state('new.offer-location', {
      url: '/offer/location',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'offer': {
          templateUrl: 'templates/offer-new-location.html',
          controller: "newOfferLocationCtrl"
        }
      }
    })

    //Search
    .state('default.search', {
      url: '/search',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/search.html',
          controller: 'HomeController'  
        }
      }
    })

    //Offer
    .state('default.offer', {
      url: '/offer',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/offer.html',
          controller:'offerCtrl'
        }
      }
    })


    //Location
    .state('default.offer-location', {
      url: '/offer/location',
      views: {

        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/location.html',
          controller:'locationCtrl'
        }
      }
    })
  

    //Comments
    .state('default.offer-comments',{
      url: '/offer-comments',
      views: {
        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/offer-comments.html',
          controller:'OfferCommentsCtrl'
        }
      }
    })

    //PinSearch
    .state('default.new-pin-search',{
      url: '/new/pin/search',
      views: {

        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/new-pin-search.html',
          controller:'newPinCtrl'
        }
      }
    })

    .state('default.new-pin-search-location',{
      url: '/new/pin/search/location',
      views: {

        'goter-options': {
          templateUrl: 'templates/goter-options.html'
        },
        'current-option': {
          templateUrl: 'templates/new-pin-search-location.html',
          controller:'newPinLocationCtrl'
        }
      }
    })
    ;


	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/signin');

});
