/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
var promise = require("promised-io/promise");
module.exports = function (server) {
  "use strict";
  var state;
  describe('plugin Geochat', function () {
    var plugin;
    it('should be init', function () {
      server.plugins.should.have.property('geochat');
    });
    plugin = server.plugins.geochat;
    it('should be have propertyes model, subscribe, send, listener', function () {
      plugin.should.have.property('model');
      plugin.should.have.property('subscribe');
      plugin.should.have.property('send');
      plugin.should.have.property('listener');
      state = plugin.model.should.be.a.Object;
      state = plugin.subscribe.should.be.a.Function;
      state = plugin.send.should.be.a.Function;
      state = plugin.listener.should.be.a.Function;
    });
    describe('method subscribe', function () {
      
      it('should be return promise', function () {
        plugin.subscribe().should.have.property('then');
        state = plugin.subscribe().then.should.be.a.Function;
      });
      /*it('should be create listener', function () {
        
      
      });*/
    });
    describe('method send', function () {
      it('should be return promise', function () {
        plugin.send().should.have.property('then');
        state = plugin.send().then.should.be.a.Function;
      });
    });
    describe('method listener', function () {
      it('should be return promise', function () {
        plugin.listener().should.have.property('then');
        state = plugin.listener().then.should.be.a.Function;
      });
    });
  });
};