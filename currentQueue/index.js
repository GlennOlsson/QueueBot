var mainApp = angular.module('mainApp', [
]);

mainApp.factory('WebSocketService', function($rootScope) {

  console.log("CONNECTING SOCEKT")

  var socket = io.connect("http://queue.csc.kth.se/socket.io/");
  console.log(socket)
  return {
    on: function(eventName, callback) {
      socket.removeAllListeners(eventName);
      socket.on(eventName, function() {
        var args = arguments;
        console.log("ON")
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        console.log("EMITER")
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
    // removeAllListeners: function(eventName, callback) { // Does not seem to work
    removeAllListeners: function(eventName, callback) { // Does not seem to work
      socket.removeAllListeners(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    }
  };
})

mainApp.controller('SocketController', ['$scope', 'WebSocketService', function($scope, socket) { 
  console.log("HEY HOPE")

  $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
    console.log("Leaving " + $scope.queue);
    socket.emit('stopListening', $scope.queue);
  });

  socket.on('join', function (data) {
    console.log("joined: " +data );
  })
  
  $scope.title = "JaG kAn"
  $scope.queue = "INDA"

  $scope.onClick = function(){
    console.log("CLICK")
    socket.emit('listen', 'lobby');
    socket.emit('stopListening', 'lobby');
    console.log("Emitted " + socket.id)
    console.log(socket)
  }

  }
]);

// mainApp.controller('socketController', ['$scope', '$location',
//   function($scope){
//     console.log("CONTROLLING")
//   }
  // function($scope, http, $location, socket, user, title) {
  //   $scope.$on('$destroy', function (event) {
  //     socket.removeAllListeners();
  //     socket.emit('stopListening', 'lobby');
  //   });
  //   socket.emit('listen', 'lobby');

  //   title.title = "Stay A While";
  //   $scope.queues = [];
  //   http.get('queueList', function(response) {
  //     $scope.queues = response;
  //     for (var index in $scope.queues) {
  //       http.get('queue/' + $scope.queues[index].name, apiGetQueue);
  //     }
  //   });

  //   function apiGetQueue(response) {
  //     var queue = getQueue(response.name);
  //     queue.position = -1;
  //     queue.queue = response.queue;
  //     for (var i in queue.queue) {
  //       if (queue.queue[i].ugKthid === user.getUgKthid()) {
  //         queue.position = parseInt(i, 10) + 1;
  //         break;
  //       }
  //     }
  //   }
  //   user.updateUserData();

  //   // Listen for a person joining a queue.
  //   socket.on('lobbyjoin', function(data) {
  //     console.log("A user joined (lobby) " + data.queueName);
  //     var queue = getQueue(data.queueName);
  //     queue.queue.push({
  //       ugKthid: data.ugKthid
  //     });
  //     queue.length++;
  //     if (data.ugKthid === user.getUgKthid()) {
  //       getQueue(data.queueName).position = getQueue(data.queueName).length;
  //     }
  //   });

  //   // Listen for a person leaving a queue.
  //   socket.on('lobbyleave', function(data) {
  //     console.log("A user left (lobby) " + data.queueName);
  //     var queue = getQueue(data.queueName);
  //     queue.length--;
  //     for (var i in queue.queue) {
  //       if (queue.queue[i].ugKthid === data.ugKthid) {
  //         queue.queue.splice(i, 1);
  //         if (parseInt(i, 10) + 1 === queue.position) {
  //           queue.position = -1;
  //         } else if (parseInt(i, 10) + 1 < queue.position) {
  //           queue.position--;
  //         }
  //         break;
  //       }
  //     }
  //   });

  //   // Listen for queue geting purged.
  //   socket.on('lobbypurge', function(queueName) {
  //     console.log(queueName + " was purged (lobby)");
  //     var queue = getQueue(queueName);
  //     queue.length = 0;
  //     queue.queue = [];
  //     queue.position = -1;
  //   });

  //   // Listen for a queue being locked.
  //   socket.on('lobbylock', function(queue) {
  //     console.log(queue + " was locked (lobby)");
  //     getQueue(queue).locked = true;
  //   });

  //   // Listen for a queue being unlocked.
  //   socket.on('lobbyunlock', function(queue) {
  //     console.log(queue + " was unlocked (lobby)");
  //     getQueue(queue).locked = false;
  //   });

  //   // Listen for a queue going to sleep.
  //   socket.on('lobbyhide', function(queue) {
  //     console.log(queue + " was sent to sleep (lobby)");
  //     getQueue(queue).hiding = true;
  //   });

  //   // Listen for a queue waking up.
  //   socket.on('lobbyshow', function(queue) {
  //     console.log(queue + " was awoken (lobby)");
  //     getQueue(queue).hiding = false;
  //   });

  //   function getQueue(queue) {
  //     for (var index in $scope.queues) {
  //       if ($scope.queues[index].name === queue) {
  //         return $scope.queues[index];
  //       }
  //     }
  //   }
  //     // This function should direct the user to the wanted page
  //   $scope.redirect = function(queue) {
  //     console.log("Trying to enter queue : " + queue.name);
  //     if (!queue.locked || $scope.accessLevel(queue.name) > 0) {
  //       console.log("Allowed to enter queue : " + queue.name);
  //       $location.hash("");
  //       $location.path('/queue/' + queue.name);
  //     }
  //   };

  //   $scope.accessLevel = function(queueName) {
  //     if (user.isAdmin()) {
  //       return 3;
  //     }
  //     return user.accessLevelFor(queueName);
  //   };

  //   $scope.noMatch = function(queueName) {
  //     if (!$scope.search) {
  //       return false;
  //     }
  //     return !(new RegExp($scope.search.toLowerCase()).test(queueName.toLowerCase()));
  //   };

  // }
// ]);

// socket.emit("HEJ HOPP")

// function onClick(){
//     console.log("CLICK")
//     socket.emit("Hej hopp", "Glenn")
//     socket.send("HEEEJ")
//     console.log("Emitted " + socket.id)
// }

// function test($rootScope) {

//     console.log("CONNECTING")

//     var socket = io.connect("http://queue.csc.kth.se/socket.io/");
//     return {
//       on: function(eventName, callback) {
//         socket.removeAllListeners(eventName);
//         socket.on(eventName, function() {
//           var args = arguments;
//           $rootScope.$apply(function() {
//             callback.apply(socket, args);
//           });
//         });
//       },
//       emit: function(eventName, data, callback) {
//         socket.emit(eventName, data, function() {
//           var args = arguments;
//           $rootScope.$apply(function() {
//             if (callback) {
//               callback.apply(socket, args);
//             }
//           });
//         });
//       },
//       // removeAllListeners: function(eventName, callback) { // Does not seem to work
//       removeAllListeners: function(eventName, callback) { // Does not seem to work
//         socket.removeAllListeners(eventName, function() {
//           var args = arguments;
//           $rootScope.$apply(function() {
//             callback.apply(socket, args);
//           });
//         });
//       }
//     };
//   }