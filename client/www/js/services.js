angular.module('goter.services', [])
    .factory('API', function ($rootScope, $http, $ionicLoading, $window) {


       //var base = "http://10.0.2.2:9804";
       //var base = "http://localhost:9804";
       var base = "http://goter.herokuapp.com";

       
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
        var searchResults = {}
        var name;

        $rootScope.set = function (data) { 
           savedData = data;
        }
       
        $rootScope.get = function () { 
          return savedData;
        }

        $rootScope.setSearchResults = function(data) { searchResults = data }
        $rootScope.getSearchResults = function()     { return searchResults }

        $rootScope.setName = function(data) { name = data }
        $rootScope.getName = function()     { return name }

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
                return $http.get(base+'/api/v1/goter/offers/' + id, {
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
            },

            deleteOffer: function (id,email) {
                return $http.delete(base+'/api/v1/goter/offer/delete/' + id, {
                    method: 'DELETE',
                    params: {
                        token: email
                    }
                });
            },
            savePinSearch: function (email, pin_search) {
                return $http.post(base + '/api/v1/goter/pin-searches', pin_search, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            },
            getPinSearchComments: function (pinSearchId, email) {
                return $http.get( base + '/api/v1/goter/pin-searches/' + pinSearchId + '/comments',
                                  {  method: 'GET', params: {  token: email  } } );
            },
            savePinSearchComment: function (pinSearchId, form, email) {
                return $http.post( base + '/api/v1/goter/pin-searches/' + pinSearchId + '/comments', 
                                   form,
                                   { method: 'POST', params: { token: email } });
            },
            getPinSearchs: function (email) {
                return $http.get(base+'/api/v1/goter/pin-searchs', {
                    method: 'GET',
                    params: {
                        token: email
                    }
                });
            },
            getPinSearch: function(id,email){
                return $http.get(base+'/api/v1/goter/pin-search/' + id, {
                    method: 'GET',
                    params: {
                        token: email,
                        id:id
                    }
                    
                });
            },
            getSearchResults: function(email,word,loc,radio){
                return $http.get(base+'/api/v1/goter/search/' + word, {
                    method: 'GET',
                    params: {
                        token: email,
                        word:word,
                        lat:loc.lat,
                        lng:loc.lng,
                        radio:radio
                    }
                    
                });
            },

            getAllOffers: function(email,loc,radio){
                return $http.get(base+'/api/v1/goter/search-offers', {
                    method: 'GET',
                    params: {
                        token: email,
                        lat:loc.lat,
                        lng:loc.lng,
                        radio:radio
                    }
                    
                });
            },

            getSearchResultsByType: function(email,type,loc,radio){
                return $http.get(base+'/api/v1/goter/search/type/' + type, {
                    method: 'GET',
                    params: {
                        token: email,
                        type:type,
                        lat:loc.lat,
                        lng:loc.lng,
                        radio:radio
                    }
                });
            },
            
            getSearchPinsResults: function(email,word,loc,radio){
                return $http.get(base+'/api/v1/goter/search-pins/' + word, {
                    method: 'GET',
                    params: {
                        token: email,
                        word:word,
                        lat:loc.lat,
                        lng:loc.lng,
                        radio:radio
                    }
                    
                });
            },

            updateOffer: function(id, form, email){
                return $http.put(base+'/api/v1/goter/offers/'+id, form, {
                    method: 'PUT',
                    params: {
                        token: email
                    }
                });
            },
            likeOffer: function (offer_id, email) {
                return $http.post(base + '/api/v1/goter/offers/' + offer_id + '/liked/' + email, {token:email}, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            },
            dislikeOffer: function (offer_id, email) {
                return $http.post(base + '/api/v1/goter/offers/' + offer_id + '/disliked/' + email, {token:email}, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            }
        };
    });