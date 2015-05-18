/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var Server = require('./server'),
  server = new Server({
    host: "localhost",
    port: 8811,
    mongo: {
      host: "localhost",
      db: "noise"
    }
  });