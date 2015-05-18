/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, after, it */
var assert = require("assert"),
  should = require('should'),
  Server = require('../server/server.js');

describe('Server', function () {
  "use strict";
  var server = new Server({
    host: "localhost",
    port: 8812,
    mongo: {
      host: "localhost",
      db: "testdb"
    }
  });
  after(function () {
    server.stop();
  });
  it('should be started', function () {
    var test = server.should.be.ok;
  });
  
  // test model-factory plugin
  require('./model-factory')(server);
});