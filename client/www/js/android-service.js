var goterAndSer;
/*// get Angular scope from the known DOM element
e = document.getElementById('myAngularApp');
scope = angular.element(e).scope();
// update the model with a wrap in $apply(fn) which will refresh the view for us
scope.$apply(function() {
    scope.controllerMethod(val);
}); */

function microappscope(){
   var elem = document.getElementById('notifications')
   //console.log("elem"+JSON.stringify(elem));
   var microappscope = angular.element(elem).scope();
   return microappscope;
}

document.addEventListener('deviceready', function() {
   var serviceName = 'com.enlix.goter.GoterService';
   var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
   goterAndSer = factory.create(serviceName);
   //goterAndSer.startService(function(r){alert(r)}, function(e){alert(e));

   goterAndSer.getStatus(function(r){startService(r)}, function(e){displayError(e)});
}, true);

/*function getStatus() {
   goterAndSer.getStatus(function(r){displayResult(r)}, function(e){displayError(e)});
}

function displayResult(data) {
   alert("Is service running: " + data.ServiceRunning);
}*/

function updateHandler(data) {
/*   if (data.LatestResult != null) {
      try {
         var resultMessage = document.getElementById("resultMessage");
         resultMessage.innerHTML = data.LatestResult.Message;
      } catch (err) {
      }
   }*/
   console.log("hola update handler");
   microappscope().$apply(function() {
      microappscope().hola();
   }); 
   //microappscope().hola()
   //console.log("hola mundo");
}

function displayError(data) {
   alert("We have an error "+e);
}

function go() {
   goterAndSer.getStatus(function(r){startService(r)}, function(e){displayError(e)});
};

function startService(data) {
   if (data.ServiceRunning) {
      enableTimer(data);
   } else {
      goterAndSer.startService(function(r){enableTimer(r)}, function(e){displayError(e)});
   }
}

function enableTimer(data) {
   if (data.TimerEnabled) {
      registerForUpdates(data);
   } else {
      goterAndSer.enableTimer(1200000, function(r){registerForUpdates(r)}, function(e){displayError(e)});
   }
}

function registerForUpdates(data) {
   if (!data.RegisteredForUpdates) {
      goterAndSer.registerForUpdates(function(r){updateHandler(r)}, function(e){handleError(e)});
   }
}

function handleError(data) {
   alert("Error: " + data.ErrorMessage);
   alert(JSON.stringify(data));
   //updateView(data);
}

function handleSuccess (r) {
   // TODO
}
function updateToken(token) {
   if (goterAndSer) {
      console.log("")
      var config = { "token": token }
      goterAndSer.setConfiguration(  
         config,
         function(r) { handleSuccess(r) },
         function(e) { handleError(e) }
      )
   }
}