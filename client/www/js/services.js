angular.module('goter.services', [])
    .factory('API', function ($rootScope, $http, $ionicLoading, $window) {

        //http://10.0.2.2:<hostport> para emular
       var base = "http://localhost:9804";
       //var base = "http://goter.herokuapp.com";
       
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        var savedData = {}

        $rootScope.set = function (data) { 
           savedData = data;
        }
       
        $rootScope.get = function () { 
          return savedData;
        }

        $rootScope.hide = function () {
            $ionicLoading.hide();
        };

        $rootScope.logout = function () {

            $rootScope.setToken("");
            $window.location.href = '#/auth/signin';

        };

        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 1999);
        };

        $rootScope.doRefresh = function (tab) {
            if(tab == 1)
                $rootScope.$broadcast('fetchAll');
            else
                $rootScope.$broadcast('fetchCompleted');
            
            $rootScope.$broadcast('scroll.refreshComplete');
        };

        $rootScope.setToken = function (token) {
            return $window.localStorage.token = token;
        }

        $rootScope.getToken = function () {
            return $window.localStorage.token;
        }

        $rootScope.isSessionActive = function () {
            return $window.localStorage.token ? true : false;
        }

        return {

            signin: function (form) {
                return $http.post(base+'/api/v1/goter/auth/login', form);
            },
            signup: function (form) {
                return $http.post(base+'/api/v1/goter/auth/register', form);
            },
            
            getOne: function (id, email) {
                return $http.get(base+'/api/v1/goter/data/item/' + id, {
                    method: 'GET',
                    params: {
                        token: email
                    }
                });
            },
            getOffer: function(id,email){
                return $http.get(base+'/api/v1/goter/offer/' + id, {
                    method: 'GET',
                    params: {
                        token: email,
                        id:id
                    }
                    
                });

            },
            getOffers: function (email) {
                return $http.get(base+'/api/v1/goter/offers', {
                    method: 'GET',
                    params: {
                        token: email
                    }
                });
            },
            saveOfferComment: function (offerId, form, email) {
                return $http.post(base + '/api/v1/goter/offers/' + offerId + '/comments', form, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            },
            getOfferComments: function (offerId, email) {
                return $http.get(base + '/api/v1/goter/offers/' + offerId + '/comments', {
                    method: 'GET',
                    params: {
                        token: email
                    }
                });
            },
            saveOffer: function (email, offer) {
                return $http.post(base+'/api/v1/goter/offers', offer, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            }
        };
    });