/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
var promise = require("promised-io/promise");
module.exports = function (server) {
  "use strict";
  var state;
  describe('plugin Profiles', function () {
    it('should be init', function () {
      server.plugins.should.have.property('profiles');
    });
  });
};