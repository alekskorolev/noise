/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var promise = require("promised-io/promise");
var plugin = function (server, options, next) {
  "use strict";
  var models = require('./model.js'),
    msgs = server.plugins.models.create(models.msgs),
    peoples = server.plugins.models.create(models.peoples),
    listeners = {},
    subscribe = function (id, point, socket) {
      var deferred = new promise.Deferred();
      peoples.get({uid: id}).then(function (listener) {
        if (listener) {
          listener.pos = point;
          listener.sid = socket;
          listener.save(function (err) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(listener);
            }
          });
        } else {
          peoples.save({uid: id, pos: point, sid: socket}).then(function (listener) {
            deferred.resolve(listener);
          }, deferred.reject);
        }
      });
      return deferred.promise;
    },
    send = function (id, msg, point) {
      var deferred = new promise.Deferred();
      
      return deferred.promise;
    },
    listener = function (point, radius) {
      var deferred = new promise.Deferred();
      peoples.fetch({where: {pos: {$nearSphere: point, $maxDistance: 0.1}}})
        .then(function (listeners) {
          deferred.resolve(listeners);
        }, deferred.reject);
      return deferred.promise;
    };
  
  server.expose('model', {msgs: msgs, peoples: peoples});
  server.expose('subscribe', subscribe);
  server.expose('send', send);
  server.expose('listener', listener);
  return next();
};
plugin.attributes = {
  name: 'geochat'
};

exports.register = plugin;