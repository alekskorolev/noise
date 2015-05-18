/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var promise = require("promised-io/promise");
var plugin = function (server, options, next) {
  "use strict";
  var model = server.plugins.models.create(require('./model.js')),
    listeners = {},
    subscribe = function (id, point, socket) {
      var deferred = new promise.Deferred();
      
      return deferred.promise;
    },
    send = function (id, msg, point) {
      var deferred = new promise.Deferred();
      
      return deferred.promise;
    },
    listener = function (id) {
      var deferred = new promise.Deferred();
      
      return deferred.promise;
    };
  
  server.expose('model', model);
  server.expose('subscribe', subscribe);
  server.expose('send', send);
  server.expose('listener', listener);
  return next();
};
plugin.attributes = {
  name: 'geochat'
};

exports.register = plugin;