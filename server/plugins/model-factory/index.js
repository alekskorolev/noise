/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var mongoose = require('mongoose');
var plugin = function (server, options, next) {
  "use strict";
  var Model = require('./model-constructor'),
    models = {};
  Model.prototype.deferred = function () {
    //console.log(server.plugins.promise);
    return new server.plugins.promise.Deferred();
  };
  mongoose.connect("mongodb://" + options.host + '/' + options.db);
  
  // model creator
  server.expose('create', function (options) {
    
    // check if model exist
    var model = models[options.name];
    
    if (!model) { // if not exist => create new model
      model = new Model(options, server);
      // add model to models pool
      models[options.name] = model;
    }
    
    return model;
  });
  
  // model getter
  server.expose('get', function (name) {
    
    if (models[name]) { // return model if exist
      return models[name];
      
    } else { // or return null if not exist
      return null;
    }
    
  });
  
  // check connection to the mongo database
  server.expose('isConnected', function () {
    return mongoose.connection.readyState;
  });
  return next();
};

plugin.attributes = {
  name: 'models'
};

exports.register = plugin;