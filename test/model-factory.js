/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
var all = require("promised-io/promise").all;
module.exports = function (server) {
  "use strict";
  var state;
  describe('plugin Factory', function () {
    it('should be init', function () {
      server.plugins.should.have.property('models');
    });
    var plugin = server.plugins.models,
      model,
      config = require('./model-factory-config');
    it('should be have methods create and get', function () {
      plugin.should.have.property('create');
      state = plugin.create.should.be.a.Function;
      plugin.should.have.property('get');
      state = plugin.get.should.be.a.Function;
    });
    it('should be connected to mongo base', function () {
      plugin.should.have.property('isConnected');
      state = plugin.isConnected.should.be.a.Function;
      state = plugin.isConnected().should.be.ok;
    });
    it('should be accept object & function pattern', function () {
      plugin.create(config[1]).should.not.throw();
      plugin.create(config[2]).should.not.throw();
    });
    it('create method should be return object', function () {
      model = plugin.create(config[0]);
      state = model.should.be.a.Object;
    });
    
    //test created model
    describe('created model', function () {
      model = plugin.create(config[0]);
      it('should be have methods save, remove, get, fetch, count', function () {
        model.should.have.property('save');
        model.should.have.property('remove');
        model.should.have.property('get');
        model.should.have.property('fetch');
        model.should.have.property('count');
        state = model.save.should.be.a.Function;
        state = model.remove.should.be.a.Function;
        state = model.get.should.be.a.Function;
        state = model.fetch.should.be.a.Function;
        state = model.count.should.be.a.Function;
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
        var uid = new Date(),
          docdata = {
            title:  "Test document id " + uid,
            author: "me",
            body:   "empty",
            comments: [],
            hidden: false,
            meta: {
              votes: 3,
              favs:  5
            }
          },
          returned = model.save(docdata);
        it('should be return promise', function () {
          returned.should.have.property('then');
          state = returned.then.should.be.a.Function;
        });
        it('should be return mongoose document in then callback', function () {
          returned.then(function (result) {
            state = result.should.be.a.Object;
            result.should.have.property('save');
            state = result.save.should.be.a.Function;
          });
        });
        it('should be return error in callback if updated doc not found', function (done) {
          model.save({_id: "sfdghgdfsdf", title: "aesdfghfgdsa"}).then(function () {
            done(new Error('document founded'));
          }, function (err) {
            done();
          });
        });
      });
      describe('method remove', function () {
        var docdata = {
          title: "object for remove"
        };
        it('should be return promise object', function () {
          model.remove().should.have.property('then');
          state = model.remove().then.should.be.a.Function;
        });
        it('should be return error if document not found', function (done) {
          model.remove({_id: "sdfgfdsadfgffdasfdgfd"}).then(function () {
            done(new Error('document removed'));
          }, function (err) {
            done();
          });
        });
        it('should be return error if call without _id', function (done) {
          model.remove({title: "sdfgfdsadfgffdasfdgfd"}).then(function () {
            done(new Error('document removed'));
          }, function (err) {
            done();
          });
        });
        it('should be remove created document', function (done) {
          model.save(docdata).then(function (model) {
            model.remove(model._id).then(function (doc) {
              done();
            }, done);
          });
        });
      });
      describe('method get', function () {
        it('should be return promise object', function () {
          model.get().should.have.property('then');
          state = model.get().then.should.be.a.Function;
        });
        it('should be return error if document not found', function (done) {
          model.remove({_id: "sdfgfdsadfgffdasfdgfd"}).then(function () {
            done(new Error('document found'));
          }, function (err) {
            done();
          });
        });
        it('should be return error if call without options', function (done) {
          model.remove().then(function () {
            done(new Error('document found without options'));
          }, function (err) {
            done();
          });
        });
        it('should be return a single document the relevant request _id', function (done) {
          model.save({title: "dsfgfesasdf"}).then(function (doc) {
            model.get(doc).then(function (_doc) {
              if (_doc._id.toString() === doc._id.toString()) {
                done();
              } else {
                done(new Error('Document _id is not relevant ' + _doc._id + ' != ' + doc._id));
              }
            }, done);
          }, done);
        });
        it('should be return a single document the relevant request', function (done) {
          model.save({title: "sdfgrseasdfdg", author: "ujkkkiol"}).then(function (doc) {
            model.get({author: "ujkkkiol"}).then(function (_doc) {
              if (_doc.author === "ujkkkiol") {
                done();
              }
            }, done);
          }, done);
        });
      });
      describe('method fetch', function () {
        it('should be return promise object', function () {
          model.fetch().should.have.property('then');
          state = model.fetch().then.should.be.a.Function;
        });
        it('should be return error if query is empty', function (done) {
          model.fetch().then(function () {
            done(new Error('Empty query call without error'));
          }, function () {
            done();
          });
        });
        it('should be return empty list if documents not found', function (done) {
          model.fetch({where: {author: "not found"}}).then(function (list) {
            if (list.length > 0) {
              done(new Error('List not empty'));
            } else {
              done();
            }
          }, done);
        });
        it('should be return document list the relevant request', function (done) {
          var uid = new Date().getTime();
          all(
            model.save({title: uid + "this finded doc 1"}),
            model.save({title: uid + "this finded doc 2"}),
            model.save({title: uid + "this finded doc 3"}),
            model.save({title: uid + "this finded doc 4"})
          ).then(function (list) {
            model.fetch({where: {title: {'$regex': uid + 'this finded doc'}}})
              .then(function (list) {
                if (list.length === 4) {
                  done();
                } else {
                  done(new Error('Find ' + list.length + ' docs, by ' + uid + ' uid'));
                }
              }, done);
          });
        });
      });
      describe('method count', function () {
        it('should be return promise object', function () {
          model.count().should.have.property('then');
          state = model.count().then.should.be.a.Function;
        });
        it('should be return error if query is empty', function (done) {
          model.count().then(function (num) {
            done(new Error('Result is not error'));
          }, function (err) {
            done();
          });
        });
        it('should be return number of documents', function (done) {
          var uid = new Date().getTime();
          all(
            model.save({title: uid + "this finded doc 1"}),
            model.save({title: uid + "this finded doc 2"}),
            model.save({title: uid + "this finded doc 3"}),
            model.save({title: uid + "this finded doc 4"})
          ).then(function (list) {
            model.count({where: {title: {'$regex': uid + 'this finded doc'}}})
              .then(function (num) {
                if (num === 4) {
                  done();
                } else {
                  done(new Error('Find ' + list.length + ' docs, by ' + uid + ' uid'));
                }
              }, done);
          });
        });
      });
    });
  });
};