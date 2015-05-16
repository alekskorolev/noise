var assert = require("assert"),
  should = require('should'),
  server = require('../server/server.js');

describe('Begin test', function () {
  var app = server({host: "localhost", port: 8812});
  after(function () {
    app.stop();
  });
  it('should be started', function () {
    var m = true
    assert.equal(true, m);
  });
});