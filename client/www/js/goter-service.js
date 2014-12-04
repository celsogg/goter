
var myService;

document.addEventListener('deviceready', function() {
   var serviceName = 'com.enlix.goter.GoterService';
   var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
   myService = factory.create(serviceName);
   //myService.startService(function(r){alert(r)}, function(e){alert(e));

   go();
}, true);

/*function getStatus() {
   myService.getStatus(function(r){displayResult(r)}, function(e){displayError(e)});
}

function displayResult(data) {
   alert("Is service running: " + data.ServiceRunning);
}

function displayError(data) {
   alert("We have an error "+e);
}
*/

function go() {
   myService.getStatus(function(r){startService(r)}, function(e){displayError(e)});
};

function startService(data) {
   if (data.ServiceRunning) {
      enableTimer(data);
   } else {
      myService.startService(function(r){enableTimer(r)}, function(e){displayError(e)});
   }
}

function enableTimer(data) {
   if (data.TimerEnabled) {
      registerForUpdates(data);
   } else {
      myService.enableTimer(60000, function(r){registerForUpdates(r)}, function(e){displayError(e)});
   }
}

function registerForUpdates(data) {
   if (!data.RegisteredForUpdates) {
      myService.registerForUpdates(function(r){updateHandler(r)}, function(e){handleError(e)});
   }
}


