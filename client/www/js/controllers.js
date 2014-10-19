angular.module('goter.controllers', [])

.controller('LoginController', function($scope) {

	
})

.controller('LoginCtrl',function($scope) {
	$scope.login = function(argument) {
		console.log(this.user.email+" "+this.user.password);
	}
})

.controller('DashController', function($scope) {
})

;