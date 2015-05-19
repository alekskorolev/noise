/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var promise = require("promised-io/promise");
var plugin = function (server, options, next) {
  "use strict";
  var model = server.plugins.models.create(require('./model.js')),
    get = function (id) {
      var deferred = new promise.Deferred();
      if (id) {
        model.get(id).then(function (profile) {
          deferred.resolve(profile);
        }, function (err) {
          model.save({}).then(function (profile) {
            deferred.resolve(profile);
          }, deferred.reject);
        });
      } else {
        deferred.reject(new Error('profile id required'));
      }
      return deferred.promise;
    },
    update = function (profile) {
      var deferred = new promise.Deferred();
      model.save(profile).then(deferred.resolve, deferred.reject);
      return deferred.promise;
    };
  server.expose('model', model);
  
  return next();
};
plugin.attributes = {
  name: 'profiles'
};

exports.register = plugin;