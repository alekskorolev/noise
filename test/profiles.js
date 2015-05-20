/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
var promise = require("promised-io/promise");
module.exports = function (server) {
  "use strict";
  var state;
  describe('plugin Profiles', function () {
    var plugin;
    it('should be init', function () {
      server.plugins.should.have.property('profiles');
    });
    plugin = server.plugins.profiles;
    it('should be have get and update methods', function () {
      state = plugin.should.be.a.Object;
      plugin.should.have.property('get');
      plugin.should.have.property('update');
      state = plugin.get.should.be.a.Function;
      state = plugin.update.should.be.a.Function;
    });
    describe('method update', function () {
      it('should be return promise', function () {
        state = plugin.update().should.be.a.Object;
        plugin.update().should.have.property('then');
        state = plugin.update().then.should.be.a.Function;
      });
      it('should be return new mongoose object', function (done) {
        plugin.update({
          dispname:  "DD",
          firstname: "Alex",
          lastname: "Korolev",
          avatar: "/pic/dd.png"
        }).then(function (profile) {
          if (profile && profile._id) {
            done();
          } else {
            done(new Error('Not mongoose object returned'));
          }
        }, done);
      });
    });
    describe('method get', function () {
      it('should be return promise', function () {
        state = plugin.get().should.be.a.Object;
        plugin.get().should.have.property('then');
        state = plugin.get().then.should.be.a.Function;
      });
      it('should be callback error if call without id', function (done) {
        plugin.get().then(function (profile) {
          done(new Error('callback without error'));
        }, function (err) {
          done();
        });
      });
      it('should be return empty profile if id is ""', function () {
        plugin.get("").then(function (profile) {
          state = profile.should.be.a.Object;
          profile.should.have.property('date');
          profile.should.have.property('_id');
        }, function (err) {
          state = err.should.not.throw;
        });
      });
      it('should be callback saved profile', function (done) {
        plugin.update({
          dispname:  "DD",
          firstname: "Alex",
          lastname: "Korolev",
          avatar: "/pic/dd.png"
        }).then(function (profile) {
          if (profile && profile._id) {
            plugin.get(profile._id).then(function (_profile) {
              if (profile._id.toString === _profile._id.toString) {
                done();
              } else {
                done(new Error('Second profile is not match to first'));
              }
            }, done);
          } else {
            done(new Error('Not mongoose object returned'));
          }
        }, done);
      });
    });
  });
};