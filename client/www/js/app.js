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

/*		.state('tab', {
>>>>>>> f0623db099bafaa6fbfc298c6c76f85d4bba347e
			url: "/tab", 
			abstract: true,
			templateUrl: "templates/tabs.html"
		})*/

  /*.state('tab.home', {
      url: '/home',
      views: {
        'home': {
          templateUrl: 'templates/home.html',
          controller: 'HomeController'
        }
      }
    })*/

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
        'home': {
          templateUrl: 'templates/home.html'
         
        }
      }
    })

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
          templateUrl: 'templates/offer-new-type.html'
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
          templateUrl: 'templates/offer-new-description.html'
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
          templateUrl: 'templates/offer-new-location.html'
        }
      }
    })




    ;

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/auth/signin');

});
