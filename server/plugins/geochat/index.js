/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var promise = require("promised-io/promise"),
  valid = require('joi');
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
      console.log(id, msg, point);
      msgs.save({
        uid: id,
        msg: msg,
        pos: point
      }).then(deferred.resolve, deferred.reject);
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
  server.route([
    {
      method: 'POST',
      path: '/geochat',
      config: {
        handler: function (request, reply) {
          var msg = request.payload.msg,
            point = request.payload.point,
            id = request.payload.uid;
          send(id, msg, point).then(function (result) {
            reply({success: true, result: result});
          }, function (err) {
            reply({success: false, error: err});
          });
        },/*
        cors: {
          credentials: true,
          origin: ["*"],
          matchOrigin: false
        },*/
        tags: ['geochat', 'api'],
        description: 'Send message',
        notes: 'Send broadcast message',
        validate: {
          payload: {
            msg: valid.string(),
            uid: valid.string(),
            point: valid.array().items(valid.number())
          }
        },
      }
    },
    {
      method: 'GET',
      path: '/geochat/subscribe/{uid?}',
      config: {
        plugins: {
          'hapi-io': 'subscribe'
        }
      },
      handler: function (request, reply) {
        console.log(request.params.uid);
      }
    }
  ]);
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