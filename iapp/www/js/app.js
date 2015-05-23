/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  $ */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
window.angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform, $localstorage, $hashkey, $http) {
    "use strict";
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      var userkey = $localstorage.get('userkey', false);
      if (window.cordova && window.cordova.plugins.Keyboard) {
        window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
      if (!userkey) {
        $localstorage.set('userkey', $hashkey.gen());
      }
    });
  })
  .factory('$socket', ['$window', '$localstorage', function ($window, $localstorage) {
    "use strict";
    var socket = $window.io('http://noise.alesan.ru');
    socket.emit('subscribe', {
      uid: $localstorage.get('userkey', "guest"),
      point: 30
    }, function (data) {
      console.log(data);
    });
    socket.on('newmsgs', function (data) {
      console.log(data);
    });
    return {
      get: function () {
      },
      on: function () {
      }
    };
  }])
  .factory('$localstorage', ['$window', function ($window) {
    "use strict";
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    };
  }])
  .factory('$msger', ['$localstorage', '$http', '$socket', function ($localstorage, $http, $socket) {
    "use strict";
    var msgs;
    return {
      restore: function () {
        msgs = $localstorage.getObject('msgs');
        msgs.list = msgs.list || [];
        // create listener from server messages
        return msgs;
      },
      clear: function () {
        $localstorage.setObject('msgs', {list: []});
      },
      recieve: function (newmsgs) {
        
      },
      send: function (msg) {
        var store = {
          body: msg.body,
          profile: {
            avatar: "img/logo.jpg"
          },
          myself: true
        };
        if (msgs.list.length > 49) {
          msgs.list.shift();
        }
        
        msgs.list.push(store);
        $localstorage.setObject('msgs', msgs);
        $http.post('http://noise.alesan.ru/geochat', {
          msg: msg.body,
          uid: msg.uid,
          point: [0, 0]
        })
          .success(function (data, status, headers, config) {
            store.sended = true;
            store.uid = data.result.uid;
            $localstorage.setObject('msgs', msgs);
            alert("succ", status);
          })
          .error(function (data, status, headers, config) {
            alert(JSON.stringify(status));
          });
        msg.sended = true;
        return msg;
      }
    };
  }])
  .factory('$hashkey', [ function () {
    "use strict";
    return {
      gen: function () {
        var d = new Date().getTime(),
          code = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
          });
        return code;
      }
    };
  }])
/*  .config(["$routeProvider", function ($routeProvider) {
    "use strict";
    $routeProvider
      .when('/chat', {
        templateUrl: "templates/chat.html",
        controller: "chatCtrl",
        controllerAs: "chatCtrl"
      });
  }])*/
  .controller("chatCtrl", ["$scope", "$rootScope", '$ionicScrollDelegate', '$msger', '$timeout', function ($scope, $rootScope, $ionicScrollDelegate, $msger, $timeout) {
    "use strict";
/*    $scope.msgs = [
      {title: "Message one", profile: { avatar: "img/logo.jpg"}},
      {title: "Message two", profile: { avatar: "img/logo.jpg"}, myself: true},
      {title: "Message thre", profile: { avatar: "img/logo.jpg"}},
      {title: "Message four", profile: { avatar: "img/logo.jpg"}}
    ];*/
    //$msger.clear();
    $scope.msgs = $msger.restore();
    $scope.$on('sendMessage', function ($evnt, $args) {
      $msger.send($args.msg);
      /*$scope.msgs.push($args.msg);*/
      if (!$scope.$phase) {
        $scope.$apply();
      }
      /*window.scrollTo(0,document.getElementById('autoScroll').height)*/
      $ionicScrollDelegate.scrollBottom({shouldAnimate: true});
    });
    $timeout(function () {
      $ionicScrollDelegate.scrollBottom();
    }, 50);
  }])
  .controller("startCtrl", ["$scope", '$timeout', '$ionicScrollDelegate', function ($scope, $timeout, $ionicScrollDelegate) {
    "use strict";
    $timeout(function () {
      $ionicScrollDelegate.scrollTop();
    }, 50);
  }])
  .directive("stateTouch", ['$state', '$rootScope', function ($state, $rootScope) {
    "use strict";
    return {
      restrict: "A",
      controller: function ($scope, $element, $attrs) {
        $state.back = $state.back || [];
        $scope.back = $state.back;
        $element.on(window.cordova ? 'touchend' : 'click', function ($evnt) {
          $state.back = $state.back || [];
          $state.last = $state.last || $state.current.name;
          var next;
          if ($attrs.stateTouch === "back") {
            next = $state.back.pop();
            if (next) {
              $state.go(next);
            } else {
              $state.go("chat");
            }
          } else {
            if ($state.current.name !== $attrs.stateTouch) {
              $state.last = $state.current.name;
              $state.back.push($state.current.name);
              $state.go($attrs.stateTouch);
            }
          }
          console.log($state.back, $state.last);
        });
      }
    };
  }])
  .directive('sendMessage', ['$rootScope', '$localstorage', function ($rootScope, $localstorage) {
    "use strict";
    return {
      restrict: "A",
      controller: function ($scope, $element, $attrs) {
        console.log($element.children()[1]);
        $element.find('button')
          .on(window.cordova ? 'touchend' : 'click', function ($evnt) {
            $rootScope.$broadcast('sendMessage',
              { msg: {
                body: $element.find('input').val(),
                uid: $localstorage.get('userkey', "guest")
              }});
            $element.find('input').val('');
//            console.log($element.find('input').val()); 
          });
      }
    };
  }])

  .config(function ($stateProvider, $urlRouterProvider) {
    "use strict";
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/chat");
    //
    // Now set up the states
    $stateProvider
      .state('chat', {
        url: "/chat",
        templateUrl: "templates/chat.html",
        controller: "chatCtrl"
      });
  
    //
    // Now set up the states
    $stateProvider
      .state('profile', {
        url: "/profile",
        templateUrl: "templates/home.html",
        controller: "startCtrl"
      });
  });