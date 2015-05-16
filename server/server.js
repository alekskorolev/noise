var Hapi = require('hapi'),
  valid = require('joi');
module.exports = function (config) {
  "use strict";
  // Create a server with a host and port
  var server = new Hapi.Server();
  server.connection({
    host: config.host || 'localhost',
    port: config.port || 8000
  });

  // Add the route
  server.route({
    method: 'GET',
    path: '/hello/{name?}',
    config: {
      handler: function (request, reply) {
        reply('hello world');
      },
      tags: ['admin', 'api'],
      description: 'Test GET',
      notes: 'test note',
      validate: {
        query: {
          age: valid.number().positive()
        }
      },
    }
  });

  server.register({
    register: require('lout')
  }, function (err) {});
  console.log('start server');
  // Start the server
  server.start();
  return server;
}