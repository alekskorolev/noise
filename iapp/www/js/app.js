/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  $ */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
window.angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
    "use strict";
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
    });
  })
/*  .config(["$routeProvider", function ($routeProvider) {
    "use strict";
    $routeProvider
      .when('/chat', {
        templateUrl: "templates/chat.html",
        controller: "chatCtrl",
        controllerAs: "chatCtrl"
      });
  }])*/
  .controller("chatCtrl", ["$scope", "$rootScope", '$ionicScrollDelegate', function ($scope, $rootScope, $ionicScrollDelegate) {
    "use strict";
    $scope.msgs = [
      {title: "Message one", profile: { avatar: "img/logo.jpg"}},
      {title: "Message two", profile: { avatar: "img/logo.jpg"}, myself: true},
      {title: "Message thre", profile: { avatar: "img/logo.jpg"}},
      {title: "Message four", profile: { avatar: "img/logo.jpg"}}
    ];
    $scope.$on('sendMessage', function ($evnt, $args) {
      $scope.msgs.push($args.msg);
      if (!$scope.$phase) {
        $scope.$apply();
      }
      /*window.scrollTo(0,document.getElementById('autoScroll').height)*/
      $ionicScrollDelegate.scrollBottom({shouldAnimate: true});
    });
  }])
  .controller("startCtrl", ["$scope", function ($scope) {
    "use strict";
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
  .directive('sendMessage', ['$rootScope', function ($rootScope) {
    "use strict";
    return {
      restrict: "A",
      controller: function ($scope, $element, $attrs) {
        console.log($element.children()[1]);
        $element.find('button')
          .on(window.cordova ? 'touchend' : 'click', function ($evnt) {
            $rootScope.$broadcast('sendMessage',
              { msg: {
                title: $element.find('input').val(),
                profile: { avatar: "img/logo.jpg"},
                myself: true
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