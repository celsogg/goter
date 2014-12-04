
var myService;

document.addEventListener('deviceready', function() {
   var serviceName = 'com.enlix.goter.GoterService';
   var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
   myService = factory.create(serviceName);
   //myService.startService(function(r){alert(r)}, function(e){alert(e));
   getStatus();
}, true);

function getStatus() {
   myService.getStatus(function(r){displayResult(r)}, function(e){displayError(e)});
}

function displayResult(data) {
   alert("Is service running: " + data.ServiceRunning);
}

function displayError(data) {
   alert("We have an error "+e);
}
