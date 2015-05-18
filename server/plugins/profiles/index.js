/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var plugin = function (server, options, next) {
  "use strict";
  
  var Model = server.plugins.models.create(require('./model.js'));
  server.expose('Model', Model);
  
  return next();
};
plugin.attributes = {
  name: 'profiles'
};

exports.register = plugin;