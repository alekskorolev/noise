/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var plugin = function (server, options, next) {
  "use strict";
  
  server.expose('test', function () {
    return 5;
  });
  
  return next();
};
plugin.attributes = {
  name: 'models'
};

exports.register = plugin;