/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
module.exports = function (server) {
  "use strict";
  describe('plugin Factory', function () {
    it('should be init', function () {
      server.plugins.should.have.property('models');
    });
    var plugin = server.plugins.models,
      model,
      config = require('./model-factory-config');
    it('should be have methods create and get', function () {
      plugin.should.have.property('create');
      plugin.create.should.be.a.Function;
      plugin.should.have.property('get');
      plugin.get.should.be.a.Function;
    });
    it('should be accept object & function pattern', function () {
      plugin.create(config[1]).should.not.throw();
      plugin.create(config[2]).should.not.throw();
    });
    it('create method should be return object', function () {
      model = plugin.create(config[0]);
      model.should.be.a.Object;
    });
    it('should be connected to mongo base', function () {
      plugin.should.have.property('isConnected');
      plugin.isConnected.should.be.a.Function;
      plugin.isConnected().should.be.ok;
    });
    
    //test created model
    describe('created model', function () {
      it('should be have methods save, remove, get, fetch', function () {
        model.should.have.property('save');
        model.should.have.property('remove');
        model.should.have.property('get');
        model.should.have.property('fetch');
        model.save.should.be.a.Function;
        model.remove.should.be.a.Function;
        model.get.should.be.a.Function;
        model.fetch.should.be.a.Function;
      });
      it('should be have propertyes name,', function () {
        model.should.have.property('name');
      });
      it('should be have access with server.plugins.models.get method', function () {
        var _model = plugin.get('user');
        _model.should.equal(model);
      });
      it('should be don`t create dublicate by create method', function () {
        var _model = plugin.create(config[0]);
        _model.should.equal(model);
      });
      describe('method save', function () {
        it('should be return mongoose document after save', function (done) {
          var uid = new Date(),
            docdata = {
              title:  "Test document id " + uid,
              author: "me",
              body:   "ampty",
              comments: [],
              hidden: false,
              meta: {
                votes: 3,
                favs:  5
              }
            },
            returned = model.save(docdata);
          returned.should.have.property('then');
          returned.then.should.be.a.Function;
          returned.then(function (result) {
            result.should.be.a.Object;
            result.should.have.property('save');
            result.save.should.be.a.Function;
          })
        });
      });
    });
  });
};